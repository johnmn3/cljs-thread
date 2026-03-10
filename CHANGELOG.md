# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0-alpha.5] - 2025-02-19

### Added
- EVE (Epoch-Versioned Entities) shared-memory persistent data structures
  - `atom`, `hash-map`, `hash-set`, `vector`, `list` backed by SharedArrayBuffer
  - Epoch-based garbage collection for safe cross-worker memory reclamation
  - WASM-accelerated bitmap allocator with SIMD optimizations
- Debug logging module with goog-define DCE support
- Comprehensive documentation (13 guides)
- Raytracer example demonstrating parallel worker performance
- X-RAY memory diagnostics for slab allocator debugging

### Changed
- Improved error handling with debug-gated logging
- Better cross-origin isolation documentation

### Fixed
- Advanced compilation compatibility with shadow-cljs :node-test targets
- Worker module loading under code splitting

## [0.1.0-alpha.4] - 2025-01-XX

### Added
- Service Worker fallback for environments without COOP/COEP headers
- DOM proxy for cross-worker DOM access
- Binding conveyance for dynamic vars

### Changed
- Fat kernel architecture for worker initialization
- Improved sync layer performance

## [0.1.0-alpha.3] - 2024-XX-XX

### Added
- Initial alpha release
- Core threading primitives: `spawn`, `in`, `future`, `pmap`, `pcalls`, `pvalues`, `=>>`
- Browser (Web Workers) and Node.js (worker_threads) support
- Auto-detection of platform capabilities

[Unreleased]: https://github.com/johnmn3/cljs-thread/compare/v0.1.0-alpha.5...HEAD
[0.1.0-alpha.5]: https://github.com/johnmn3/cljs-thread/compare/v0.1.0-alpha.4...v0.1.0-alpha.5
[0.1.0-alpha.4]: https://github.com/johnmn3/cljs-thread/compare/v0.1.0-alpha.3...v0.1.0-alpha.4
[0.1.0-alpha.3]: https://github.com/johnmn3/cljs-thread/releases/tag/v0.1.0-alpha.3
