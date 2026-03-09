#!/bin/bash
# ccweb-setup.sh - Setup script for Claude Code web development environment
# Handles proxy configuration for shadow-cljs dependency resolution.
#
# Usage:
#   source scripts/ccweb-setup.sh     # Source to set env vars in current shell
#   bash scripts/ccweb-setup.sh       # Run standalone to install deps
#
# After sourcing, use `shadow-compile` and `shadow-test` functions.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ─────────────────────────────────────────────────────────────
# Proxy Detection & Java Configuration
# ─────────────────────────────────────────────────────────────
setup_proxy() {
    # Use HTTPS_PROXY (always set in this environment) or fall back to http_proxy
    local proxy_url="${HTTPS_PROXY:-${HTTP_PROXY:-${http_proxy}}}"
    if [ -z "$proxy_url" ]; then
        echo "[ccweb] No proxy detected"
        return 0
    fi

    # Parse http://user:password@host:port
    local proxy_user=$(echo "$proxy_url" | sed -E 's|.*://([^:]+):.*@.*|\1|')
    local proxy_pass=$(echo "$proxy_url" | sed -E 's|.*://[^:]+:([^@]+)@.*|\1|')
    local proxy_host=$(echo "$proxy_url" | sed -E 's|.*@([^:]+):([0-9]+)|\1|')
    local proxy_port=$(echo "$proxy_url" | sed -E 's|.*@[^:]+:([0-9]+)$|\1|')

    if [ -z "$proxy_host" ] || [ -z "$proxy_port" ]; then
        echo "[ccweb] Could not parse proxy URL"
        return 1
    fi

    export JAVA_TOOL_OPTIONS="-Dhttp.proxyHost=$proxy_host -Dhttp.proxyPort=$proxy_port -Dhttps.proxyHost=$proxy_host -Dhttps.proxyPort=$proxy_port"
    echo "[ccweb] Java proxy configured: $proxy_host:$proxy_port"

    # Write Maven settings.xml so Apache HttpClient (used by clj's dep resolver)
    # also routes through the proxy — JAVA_TOOL_OPTIONS alone doesn't cover it.
    mkdir -p ~/.m2
    cat > ~/.m2/settings.xml <<EOF
<settings>
  <proxies>
    <proxy>
      <id>ccweb-http</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>${proxy_host}</host>
      <port>${proxy_port}</port>
      <username>${proxy_user}</username>
      <password>${proxy_pass}</password>
      <nonProxyHosts>localhost|127.0.0.1|*.local|*.googleapis.com|*.google.com</nonProxyHosts>
    </proxy>
    <proxy>
      <id>ccweb-https</id>
      <active>true</active>
      <protocol>https</protocol>
      <host>${proxy_host}</host>
      <port>${proxy_port}</port>
      <username>${proxy_user}</username>
      <password>${proxy_pass}</password>
      <nonProxyHosts>localhost|127.0.0.1|*.local|*.googleapis.com|*.google.com</nonProxyHosts>
    </proxy>
  </proxies>
</settings>
EOF
    echo "[ccweb] Maven settings.xml written with proxy credentials"
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
# Convenience functions (available after sourcing)
# ─────────────────────────────────────────────────────────────

# Compile a shadow-cljs build target
shadow-compile() {
    local target=${1:?Usage: shadow-compile <build-target>}
    local mode=${2:-compile}  # compile or release
    (cd "$PROJECT_DIR" && npx shadow-cljs "$mode" "$target")
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
# Install Clojure CLI (clj / clojure) if not present
# ─────────────────────────────────────────────────────────────
install_clj() {
    if command -v clojure &>/dev/null; then
        echo "[ccweb] Clojure CLI already installed: $(clojure --version 2>&1 | head -1)"
        return 0
    fi

    echo "[ccweb] Installing Clojure CLI..."
    local installer="/tmp/linux-install-clj.sh"
    curl -sL -o "$installer" \
        https://github.com/clojure/brew-install/releases/latest/download/linux-install.sh \
        && bash "$installer" \
        && rm -f "$installer" \
        && echo "[ccweb] Clojure CLI installed: $(clojure --version 2>&1 | head -1)" \
        || echo "[ccweb] WARN: Clojure CLI install failed (JVM tests require clj)"
}

# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────
_ccweb_main() {
    cd "$PROJECT_DIR"

    # npm setup
    if [ ! -d "node_modules/shadow-cljs" ]; then
        echo "[ccweb] Installing npm dependencies..."
        npm install 2>/dev/null
    fi

    setup_proxy
    install_clj
    download_git_deps

    # Let shadow-cljs resolve and cache its Maven dependencies
    echo "[ccweb] Resolving shadow-cljs dependencies..."
    npx shadow-cljs classpath >/dev/null 2>&1 \
        && echo "[ccweb] shadow-cljs dependencies resolved" \
        || echo "[ccweb] WARN: shadow-cljs classpath resolution failed"

    echo ""
    echo "[ccweb] Setup complete! Available commands:"
    echo "  shadow-compile <target>  - Compile a shadow-cljs build"
    echo "  shadow-run <file>        - Run compiled JS"
    echo "  shadow-build-run <target> <file> - Compile and run"
    echo ""
    echo "  Example: shadow-compile thread-test"
    echo "  Example: shadow-build-run thread-test target/thread-test/all.js"
}

# Run main if executed (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    _ccweb_main
fi
