#!/usr/bin/env python3
"""Comprehensive rename script for eve codebase refactoring.

Performs all type, function, and predicate renames in the correct order
using temporary placeholders to avoid collision.

Renames:
  SharedAtom → AtomDomain
  EmbeddedSharedAtom → SharedAtom
  slab-map → hash-map, sab-set → hash-set, etc.
  init-all-slabs! → init!
  Various sab/slab internal names → canonical names
"""

import os
import glob

def apply_replacements(content, replacements):
    for old, new in replacements:
        content = content.replace(old, new)
    return content

# All replacements in strict order (longer/more-specific patterns first)
ALL_REPLACEMENTS = [
    # =================================================================
    # PHASE 1: SharedAtom <-> EmbeddedSharedAtom type swap
    # =================================================================

    # Step 1a: Protect EmbeddedSharedAtom patterns with temp placeholders
    ('IEmbeddedSharedAtom', '___TEMP_IESA___'),
    ('->EmbeddedSharedAtom', '___TEMP_CTOR_ESA___'),
    ('EmbeddedSharedAtom', '___TEMP_ESA___'),

    # Step 1b: Rename SharedAtom → AtomDomain
    ('->SharedAtom', '->AtomDomain'),
    ('SharedAtom', 'AtomDomain'),

    # Step 1c: Restore EmbeddedSharedAtom temps → SharedAtom (new name)
    ('___TEMP_IESA___', 'ISharedAtom'),
    ('___TEMP_CTOR_ESA___', '->SharedAtom'),
    ('___TEMP_ESA___', 'SharedAtom'),

    # =================================================================
    # PHASE 2: Predicate and function renames for atom types
    # =================================================================

    # Protect embedded-atom patterns (they become shared-atom)
    ('embedded-atom?', '___TEMP_EA_PRED___'),
    ('embedded-atom-id', '___TEMP_EA_ID___'),
    ('"embedded-atom"', '___TEMP_STR_EA___'),
    ('embedded-atom', '___TEMP_EA___'),

    # Rename shared-atom patterns → atom-domain
    ('shared-atom?', 'atom-domain?'),
    ('"shared-atom"', '"atom-domain"'),
    ('parent-shared-atom-id', 'parent-atom-domain-id'),
    ('parent-shared-atom', 'parent-atom-domain'),
    ('target-shared-atom', 'target-atom-domain'),
    ('shared-atom-deftype-instance', 'atom-domain-deftype-instance'),

    # Restore embedded → shared-atom (new names)
    ('___TEMP_EA_PRED___', 'shared-atom?'),
    ('___TEMP_EA_ID___', 'shared-atom-id'),
    ('___TEMP_STR_EA___', '"shared-atom"'),
    ('___TEMP_EA___', 'shared-atom'),

    # =================================================================
    # PHASE 3: private-atom → atom-domain
    # =================================================================

    ('do-private-atom-swap!', 'do-atom-domain-swap!'),
    ('the-private-atom-instance', 'the-atom-domain-instance'),
    ('read-private-atom-root-data-block-desc-idx', 'read-atom-domain-root-data-block-desc-idx'),
    ('cas-private-atom-root-data-block-desc-idx!', 'cas-atom-domain-root-data-block-desc-idx!'),
    ('private-atom', 'atom-domain'),

    # =================================================================
    # PHASE 4: Data structure type renames
    # =================================================================

    # Map types (longest first to avoid substring collision)
    ('TransientSabMap', 'TransientEveHashMap'),
    ('SabMapRoot', 'EveHashMap'),
    ('make-sab-map-root-from-header', 'make-eve-hash-map-from-header'),
    ('make-sab-map-root', 'make-eve-hash-map'),

    # Set types (longest first)
    ('TransientSabSet', 'TransientEveHashSet'),
    ('SabSetRoot', 'EveHashSet'),
    ('make-sab-set-root-from-header', 'make-eve-hash-set-from-header'),
    ('make-sab-set-root', 'make-eve-hash-set'),

    # =================================================================
    # PHASE 5: Data structure function renames
    # =================================================================

    # Map functions (longest first)
    ('into-sab-map', 'into-hash-map'),
    ('empty-slab-map', 'empty-hash-map'),
    # slab-map → hash-map (also catches it inside empty-slab-map but that's already done)
    ('slab-map', 'hash-map'),
    ('sab-preduce', 'preduce'),

    # Set functions (longest first)
    ('into-sab-set', 'into-hash-set'),
    ('empty-sab-set', 'empty-hash-set'),
    # sab-set → hash-set (also catches inside empty-sab-set but already done)
    ('sab-set', 'hash-set'),

    # =================================================================
    # PHASE 6: Serialization tag renames
    # =================================================================

    (':sab-map', ':eve-hash-map'),
    (':sab-set', ':eve-hash-set'),
    (':sab-list', ':eve-list'),
    (':sab-vec', ':eve-vec'),

    # =================================================================
    # PHASE 7: sab->cljs internal function rename
    # =================================================================
    ('sab->cljs', 'eve->cljs'),

    # =================================================================
    # PHASE 8: init-all-slabs! → init!
    # =================================================================
    ('init-all-slabs!', 'init!'),

    # =================================================================
    # PHASE 9: Namespace alias renames
    # =================================================================
    (':as slab-atom', ':as eve-alloc'),
    ('slab-atom/', 'eve-alloc/'),
    (':as slab-xray', ':as eve-xray'),
    ('slab-xray/', 'eve-xray/'),

    # =================================================================
    # PHASE 10: eve-shared-atom? / eve-embedded-atom? in in.cljs/spawn.cljs
    # =================================================================
    # These are internal duck-type check functions
    ('eve-embedded-atom?', '___TEMP_EEA___'),
    ('eve-shared-atom?', 'eve-atom-domain?'),
    ('___TEMP_EEA___', 'eve-shared-atom?'),
]

def main():
    root = '/home/user/eve'

    # Find all relevant files
    extensions = ['*.cljs', '*.clj', '*.cljc', '*.md', '*.html', '*.js', '*.edn']
    exclude_dirs = {'.git', 'node_modules', 'target', '.shadow-cljs', '.cpcache',
                    'bench', '.clj-kondo'}

    files_to_process = []
    for ext in extensions:
        pattern = os.path.join(root, '**', ext)
        for f in glob.glob(pattern, recursive=True):
            # Skip excluded directories
            parts = f.split(os.sep)
            if not any(d in parts for d in exclude_dirs):
                files_to_process.append(f)

    modified_count = 0
    modified_files = []

    for filepath in sorted(set(files_to_process)):
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                original = f.read()
        except Exception as e:
            print(f"SKIP (read error): {filepath}: {e}")
            continue

        modified = apply_replacements(original, ALL_REPLACEMENTS)

        if modified != original:
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(modified)
                rel_path = os.path.relpath(filepath, root)
                modified_files.append(rel_path)
                modified_count += 1
            except Exception as e:
                print(f"SKIP (write error): {filepath}: {e}")

    print("=== Modified files ===")
    for f in modified_files:
        print(f"  {f}")
    print(f"\nTotal files modified: {modified_count}")

if __name__ == '__main__':
    main()
