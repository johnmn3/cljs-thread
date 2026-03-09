{
  "targets": [{
    "target_name": "mmap_cas",
    "sources":     ["native/mmap_cas.cc"],
    "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
    "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS", "NODE_ADDON_API_DISABLE_DEPRECATED"],
    "conditions": [
      ["OS!='win'", { "cflags_cc": ["-std=c++20", "-O2"] }],
      ["OS=='mac'", {
        "xcode_settings": {
          "CLANG_CXX_LANGUAGE_STANDARD": "c++20",
          "OTHER_CPLUSPLUSFLAGS": ["-std=c++20", "-O2"]
        }
      }],
      ["OS=='win'", {
        "msvs_settings": {
          "VCCLCompilerTool": { "AdditionalOptions": ["/std:c++20"] }
        }
      }]
    ]
  }]
}
