#!/usr/bin/env python3
"""Simple nREPL client for evaluating ClojureScript forms via shadow-cljs."""

import socket
import sys
import time
import uuid

# Minimal bencode implementation
def bencode(obj):
    if isinstance(obj, int):
        return f"i{obj}e".encode()
    elif isinstance(obj, str):
        b = obj.encode("utf-8")
        return f"{len(b)}:".encode() + b
    elif isinstance(obj, bytes):
        return f"{len(obj)}:".encode() + obj
    elif isinstance(obj, list):
        return b"l" + b"".join(bencode(x) for x in obj) + b"e"
    elif isinstance(obj, dict):
        items = sorted(obj.items())
        return b"d" + b"".join(bencode(k) + bencode(v) for k, v in items) + b"e"
    raise TypeError(f"Cannot bencode {type(obj)}")

def bdecode(data, pos=0):
    if data[pos:pos+1] == b"i":
        end = data.index(b"e", pos)
        return int(data[pos+1:end]), end + 1
    elif data[pos:pos+1] == b"l":
        pos += 1
        items = []
        while data[pos:pos+1] != b"e":
            item, pos = bdecode(data, pos)
            items.append(item)
        return items, pos + 1
    elif data[pos:pos+1] == b"d":
        pos += 1
        d = {}
        while data[pos:pos+1] != b"e":
            key, pos = bdecode(data, pos)
            val, pos = bdecode(data, pos)
            if isinstance(key, bytes):
                key = key.decode("utf-8")
            d[key] = val
        return d, pos + 1
    elif data[pos:pos+1].isdigit():
        colon = data.index(b":", pos)
        length = int(data[pos:colon])
        start = colon + 1
        return data[start:start+length], start + length
    else:
        raise ValueError(f"Cannot bdecode at pos {pos}: {data[pos:pos+10]}")

def recv_messages(sock, timeout=30):
    """Receive and decode all nREPL response messages until 'done' status."""
    messages = []
    sock.settimeout(timeout)
    buf = b""
    while True:
        try:
            chunk = sock.recv(4096)
            if not chunk:
                break
            buf += chunk
            # Try to decode messages from buffer
            while buf:
                try:
                    msg, pos = bdecode(buf)
                    messages.append(msg)
                    buf = buf[pos:]
                    if isinstance(msg, dict):
                        status = msg.get("status", [])
                        if isinstance(status, list):
                            status = [s.decode("utf-8") if isinstance(s, bytes) else s for s in status]
                        if "done" in status:
                            return messages
                except (ValueError, IndexError):
                    break  # need more data
        except socket.timeout:
            break
    return messages

def nrepl_eval(host, port, code, build_id=":core", timeout=30):
    """Connect to nREPL, switch to CLJS REPL for build_id, eval code."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((host, port))

    # Clone session
    msg_id = str(uuid.uuid4())
    sock.sendall(bencode({"op": "clone", "id": msg_id}))
    responses = recv_messages(sock, timeout=10)
    session = None
    for r in responses:
        if "new-session" in r:
            session = r["new-session"]
            if isinstance(session, bytes):
                session = session.decode("utf-8")
            break
    if not session:
        print("ERROR: Failed to get nREPL session")
        sock.close()
        return

    print(f"Session: {session[:8]}...")

    # Switch to CLJS REPL for the build
    init_code = f'(shadow.cljs.devtools.api/nrepl-select {build_id})'
    msg_id = str(uuid.uuid4())
    sock.sendall(bencode({"op": "eval", "code": init_code, "id": msg_id, "session": session}))
    responses = recv_messages(sock, timeout=15)
    for r in responses:
        val = r.get("value", r.get("out", b""))
        if isinstance(val, bytes):
            val = val.decode("utf-8")
        if val:
            print(f"  init: {val.strip()}")
        err = r.get("err", b"")
        if isinstance(err, bytes):
            err = err.decode("utf-8")
        if err:
            print(f"  init-err: {err.strip()}")

    # Now eval each form
    results = []
    for form in code:
        print(f"\n=> {form}")
        msg_id = str(uuid.uuid4())
        sock.sendall(bencode({"op": "eval", "code": form, "id": msg_id, "session": session}))
        responses = recv_messages(sock, timeout=timeout)
        result = {"form": form, "values": [], "out": [], "err": []}
        for r in responses:
            for key in ["value", "out", "err"]:
                v = r.get(key, b"")
                if isinstance(v, bytes):
                    v = v.decode("utf-8")
                if v:
                    result[key + "s" if key == "value" else key].append(v)
            # Check for errors
            ex = r.get("ex", b"")
            if isinstance(ex, bytes):
                ex = ex.decode("utf-8")
            if ex:
                result["err"].append(f"Exception: {ex}")

        for v in result["out"]:
            print(f"   out: {v.strip()}")
        for v in result["values"]:
            print(f"   => {v.strip()}")
        for v in result["err"]:
            print(f"   ERR: {v.strip()}")

        results.append(result)

    sock.close()
    return results


if __name__ == "__main__":
    host = sys.argv[1] if len(sys.argv) > 1 else "localhost"
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8777
    build = sys.argv[3] if len(sys.argv) > 3 else ":core"

    forms = [
        # Diagnose REPL context
        '(println :worker? (exists? js/importScripts) :screen? (exists? js/document))',

        # Require cljs-thread API
        '(require \'[cljs-thread.core :as thread :refer [future spawn in =>> pmap pcalls pvalues]])',

        # Check thread/id
        'thread/id',

        # Basic spawn (returns thread object)
        '(spawn (println :hello-from-spawn))',

        # Spawn with promise resolution (screen thread can\'t block)
        '(-> (spawn (+ 1 2 3)) deref (.then #(println :spawn-result %)))',

        # Named spawn
        '(def s1 (spawn))',

        # In - send work to named worker
        '(in s1 (println :hi-from-s1))',

        # In with promise resolution
        '(-> (in s1 (+ 10 20)) deref (.then #(println :in-result %)))',

        # Future with promise resolution
        '(-> (future (+ 2 3)) deref (.then #(println :future-result %)))',

        # Nested future - use future+println since inner @ needs worker thread
        '(future (println :nested-future @(future (+ 1 @(future (+ 2 3))))))',

        # Higher-order with core fns (tests wrapping) - via future+println
        '(future (println :reduce-result @(future (reduce + 0 (range 10)))))',
        '(future (println :filter-result @(future (filter even? (range 10)))))',
        '(future (println :map-result @(future (map inc [1 2 3]))))',

        # pmap - must run in worker thread context
        '(future (println :pmap-result (vec (pmap inc [1 2 3 4 5]))))',

        # Nested in via future
        '(def s2 (spawn))',
        '(future (println :nested-in @(in s1 (+ 1 @(in s2 (+ 2 3))))))',

        # Let bindings conveyed via future
        '(future (let [x 42] (println :conveyed @(in s1 (+ x 1)))))',

        # flip function from dashboard
        '(defn flip [n] (apply comp (take n (cycle [inc inc dec]))))',

        # =>> with injest require
        '(require \'[injest.path])',
        '(=>> (range 10) (map inc) (filter odd?) (take 5))',

        # flip + =>>
        '(=>> (range) (map (flip 10)) (map (flip 10)) (map (flip 10)) (take 10))',

        # Done
        ':done',
    ]

    nrepl_eval(host, port, forms, build_id=build)
