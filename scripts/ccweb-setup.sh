#!/bin/bash
# ccweb-setup.sh - Setup script for Claude Code web development environment
# Handles proxy configuration and Maven dependency bootstrapping for shadow-cljs
#
# Usage:
#   source scripts/ccweb-setup.sh     # Source to set env vars in current shell
#   bash scripts/ccweb-setup.sh       # Run standalone to download deps
#
# After sourcing, use `shadow-compile` and `shadow-test` functions.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
M2_REPO="/root/.m2/repository"
SHADOW_VERSION="3.3.5"

# ─────────────────────────────────────────────────────────────
# Proxy Detection & Java Configuration
# ─────────────────────────────────────────────────────────────
setup_proxy() {
    if [ -z "$http_proxy" ]; then
        echo "[ccweb] No proxy detected"
        return 0
    fi

    # Extract proxy host and port
    local proxy_host=$(echo "$http_proxy" | sed -E 's|.*@([^:]+):([0-9]+)$|\1|')
    local proxy_port=$(echo "$http_proxy" | sed -E 's|.*@([^:]+):([0-9]+)$|\2|')

    if [ -z "$proxy_host" ] || [ -z "$proxy_port" ]; then
        echo "[ccweb] Could not parse proxy from \$http_proxy"
        return 1
    fi

    export JAVA_TOOL_OPTIONS="-Dhttp.proxyHost=$proxy_host -Dhttp.proxyPort=$proxy_port -Dhttps.proxyHost=$proxy_host -Dhttps.proxyPort=$proxy_port"
    echo "[ccweb] Java proxy configured: $proxy_host:$proxy_port"
}

# ─────────────────────────────────────────────────────────────
# Maven Artifact Downloader (uses curl which handles proxy auth)
# ─────────────────────────────────────────────────────────────
_dl() {
    local group_path=$1
    local artifact=$2
    local version=$3
    local classifier=${4:-}
    local repo=${5:-central}

    local base_url="https://repo1.maven.org/maven2"
    [ "$repo" = "clojars" ] && base_url="https://repo.clojars.org"

    local jar_name="${artifact}-${version}${classifier:+-$classifier}.jar"
    local dir="$M2_REPO/$group_path/$artifact/$version"
    local target="$dir/$jar_name"

    [ -f "$target" ] && return 0

    mkdir -p "$dir"
    echo "  [dl] $group_path/$artifact $version${classifier:+ ($classifier)}"
    curl -sf -o "$target" "$base_url/$group_path/$artifact/$version/$jar_name" 2>/dev/null || {
        echo "    WARN: $jar_name not found at $repo"
        rm -f "$target"
        return 1
    }
    # Also grab POM (best effort)
    curl -sf -o "$dir/${artifact}-${version}.pom" \
        "$base_url/$group_path/$artifact/$version/${artifact}-${version}.pom" 2>/dev/null || true
}

# ─────────────────────────────────────────────────────────────
# Download all shadow-cljs + project dependencies
# ─────────────────────────────────────────────────────────────
download_deps() {
    echo "[ccweb] Downloading Maven dependencies..."

    # Shadow-cljs core (AOT uberjar from Clojars)
    _dl thheller shadow-cljs $SHADOW_VERSION aot clojars

    # Clojure runtime
    _dl org/clojure clojure 1.12.0
    _dl org/clojure spec.alpha 0.5.238
    _dl org/clojure core.specs.alpha 0.4.74

    # ClojureScript
    _dl org/clojure clojurescript 1.12.134
    _dl org/clojure google-closure-library 0.0-20250515-f04e4c0e
    _dl org/clojure google-closure-library-third-party 0.0-20250515-f04e4c0e

    # Closure compiler
    _dl com/google/javascript closure-compiler v20250407

    # Core Clojure libs
    _dl org/clojure data.json 2.5.1
    _dl org/clojure tools.cli 1.1.230
    _dl org/clojure tools.reader 1.5.2
    _dl org/clojure core.async 1.8.741
    _dl org/clojure tools.analyzer 1.2.0
    _dl org/clojure tools.analyzer.jvm 1.3.1
    _dl org/clojure core.memoize 1.1.266
    _dl org/clojure core.cache 1.1.234
    _dl org/clojure data.priority-map 1.2.0
    _dl org/clojure core.rrb-vector 0.2.0
    _dl org/clojure test.check 1.1.1

    # Transit
    _dl com/cognitect transit-clj 1.0.333
    _dl com/cognitect transit-cljs 0.8.280
    _dl com/cognitect transit-java 1.0.371
    _dl com/cognitect transit-js 0.8.874

    # nREPL
    _dl nrepl nrepl 1.3.1 "" clojars
    _dl nrepl bencode 1.2.0 "" clojars

    # Shadow deps
    _dl thheller shadow-util 0.7.0 "" clojars
    _dl thheller shadow-client 1.4.0 "" clojars
    _dl thheller shadow-undertow 0.3.4 "" clojars
    _dl thheller shadow-cljsjs 0.0.22 "" clojars

    # Piggieback
    _dl cider piggieback 0.6.0 "" clojars

    # Web / Ring
    _dl ring ring-core 1.14.1 "" clojars
    _dl ring ring-codec 1.2.0 "" clojars
    _dl commons-fileupload commons-fileupload 1.5
    _dl commons-io commons-io 2.18.0
    _dl commons-codec commons-codec 1.18.0
    _dl crypto-equality crypto-equality 1.0.1 "" clojars
    _dl crypto-random crypto-random 1.2.1 "" clojars

    # Undertow
    _dl io/undertow undertow-core 2.3.18.Final
    _dl org/jboss/logging jboss-logging 3.6.1.Final
    _dl org/jboss/xnio xnio-api 3.8.16.Final
    _dl org/jboss/xnio xnio-nio 3.8.16.Final
    _dl org/wildfly/common wildfly-common 1.7.0.Final
    _dl org/jboss/threads jboss-threads 3.8.0.Final

    # File watching
    _dl io/methvin directory-watcher 0.19.0

    # Misc
    _dl hiccup hiccup 1.0.5 "" clojars
    _dl expound expound 0.9.0 "" clojars
    _dl fipp fipp 0.6.27 "" clojars
    _dl com/bhauman cljs-test-display 0.1.1 "" clojars

    # Jackson (transit)
    _dl com/fasterxml/jackson/core jackson-core 2.18.2

    # Msgpack
    _dl org/msgpack msgpack 0.6.12
    _dl org/javassist javassist 3.18.1-GA
    _dl com/googlecode/json-simple json-simple 1.1.1

    # ASM
    _dl org/ow2/asm asm 9.7.1

    # Google libs
    _dl com/google/guava guava 33.4.5-jre
    _dl com/google/guava failureaccess 1.0.2
    _dl com/google/code/findbugs jsr305 3.0.2
    _dl com/google/errorprone error_prone_annotations 2.36.0
    _dl com/google/code/gson gson 2.12.1
    _dl com/google/protobuf protobuf-java 4.29.3
    _dl com/google/re2j re2j 1.7
    _dl args4j args4j 2.33

    # JAXB
    _dl javax/xml/bind jaxb-api 2.4.0-b180830.0359

    # Injest (used by cljs-thread)
    _dl net/clojars/john injest 0.1.0-beta.8 "" clojars

    local jar_count=$(find "$M2_REPO" -name "*.jar" -type f | wc -l)
    echo "[ccweb] $jar_count jars in local Maven cache"
}

# ─────────────────────────────────────────────────────────────
# Download git-dep sources that aren't available as Maven artifacts
# ─────────────────────────────────────────────────────────────
download_git_deps() {
    # reagami (io.github.borkdude/reagami git/sha 562cf3d)
    # Required by ex/reagami_counter builds via [reagami.core :as reagami]
    local reagami_dir="$PROJECT_DIR/ex/reagami"
    if [ ! -f "$reagami_dir/core.cljc" ]; then
        echo "[ccweb] Downloading reagami/core.cljc from GitHub..."
        mkdir -p "$reagami_dir"
        curl -sf -o "$reagami_dir/core.cljc" \
            "https://raw.githubusercontent.com/borkdude/reagami/562cf3d/src/reagami/core.cljc" \
            && echo "[ccweb] reagami/core.cljc downloaded" \
            || echo "[ccweb] WARN: reagami/core.cljc download failed"
    fi
}

# ─────────────────────────────────────────────────────────────
# Build classpath string from local M2 cache
# ─────────────────────────────────────────────────────────────
build_classpath() {
    # Build classpath from classpath.edn files list (authoritative)
    # Falls back to scanning M2 if classpath.edn doesn't exist
    local cp_edn="$PROJECT_DIR/.shadow-cljs/classpath.edn"
    if [ -f "$cp_edn" ]; then
        # Extract jar paths from classpath.edn
        local cp=$(grep -oP '"(/[^"]+\.jar)"' "$cp_edn" | tr -d '"' | tr '\n' ':')
        echo "${cp}src:test:resources"
    else
        # Fallback: scan M2 but exclude old shadow-cljs versions
        local cp=$(find "$M2_REPO" -name "*.jar" -type f \
            ! -path "*/shadow-cljs/2.28.20/*" \
            | sort | tr '\n' ':')
        echo "${cp}src:test:resources"
    fi
}

# ─────────────────────────────────────────────────────────────
# Generate .shadow-cljs/classpath.edn so npx shadow-cljs can also work
# ─────────────────────────────────────────────────────────────
generate_classpath_edn() {
    local cp_dir="$PROJECT_DIR/.shadow-cljs"
    mkdir -p "$cp_dir"

    local files_str=""
    while IFS= read -r jar; do
        [ -n "$files_str" ] && files_str="$files_str "
        files_str="$files_str\"$jar\""
    done < <(find "$M2_REPO" -name "*.jar" -type f \
        ! -path "*/shadow-cljs/2.28.20/*" \
        ! -path "*/shadow-cljs/3.3.6/*" \
        | sort)

    cat > "$cp_dir/classpath.edn" << EOFCP
{:dependencies [[thheller/shadow-cljs "$SHADOW_VERSION" :classifier "aot"]],
 :version "$SHADOW_VERSION",
 :files [$files_str]}
EOFCP
}

# ─────────────────────────────────────────────────────────────
# Convenience functions (available after sourcing)
# ─────────────────────────────────────────────────────────────

# Compile a shadow-cljs build target
shadow-compile() {
    local target=${1:?Usage: shadow-compile <build-target>}
    local mode=${2:-compile}  # compile or release
    local cp=$(build_classpath)

    (cd "$PROJECT_DIR" && \
     java -cp "${cp}src:ex:ex/raytracer/src:ex/reagami_counter/src:test:resources" \
          clojure.main -m shadow.cljs.devtools.cli --npm "$mode" "$target")
}

# Run shadow-cljs compiled output
shadow-run() {
    local target=${1:?Usage: shadow-run <output-file>}
    node "$target"
}

# Compile and run a build target
shadow-build-run() {
    local target=${1:?Usage: shadow-build-run <build-target> <output-file>}
    local output=${2:?Usage: shadow-build-run <build-target> <output-file>}
    shadow-compile "$target" && node "$output"
}

# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────
_ccweb_main() {
    cd "$PROJECT_DIR"

    # npm setup
    if [ ! -d "node_modules/shadow-cljs" ]; then
        echo "[ccweb] Installing npm dependencies..."
        npm install shadow-cljs 2>/dev/null
    fi

    setup_proxy
    download_deps
    download_git_deps
    generate_classpath_edn

    echo ""
    echo "[ccweb] Setup complete! Available commands:"
    echo "  shadow-compile <target>  - Compile a shadow-cljs build"
    echo "  shadow-run <file>        - Run compiled JS"
    echo "  shadow-build-run <target> <file> - Compile and run"
    echo ""
    echo "  Example: shadow-compile slab-unit-test"
    echo "  Example: shadow-build-run core-test target/thread-test/core-test.js"
}

# Run main if executed (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    _ccweb_main
fi
