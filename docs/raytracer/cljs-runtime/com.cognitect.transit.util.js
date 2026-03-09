goog.provide("com.cognitect.transit.util");
goog.require("goog.object");
goog.scope(function() {
  var util = com.cognitect.transit.util;
  var gobject = goog.object;
  if (typeof Object.keys != "undefined") {
    util.objectKeys = function(obj) {
      return Object.keys(obj);
    };
  } else {
    util.objectKeys = function(obj) {
      return gobject.getKeys(obj);
    };
  }
  if (typeof Array.isArray != "undefined") {
    util.isArray = function(obj) {
      return Array.isArray(obj);
    };
  } else {
    util.isArray = function(obj) {
      return goog.typeOf(obj) === "array";
    };
  }
  util.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d";
  util.randInt = function(ub) {
    return Math.round(Math.random() * ub);
  };
  util.randHex = function() {
    return util.randInt(15).toString(16);
  };
  util.randomUUID = function() {
    var rhex = (8 | 3 & util.randInt(14)).toString(16);
    var ret = util.randHex() + util.randHex() + util.randHex() + util.randHex() + util.randHex() + util.randHex() + util.randHex() + util.randHex() + "-" + util.randHex() + util.randHex() + util.randHex() + util.randHex() + "-" + "4" + util.randHex() + util.randHex() + util.randHex() + "-" + rhex + util.randHex() + util.randHex() + util.randHex() + "-" + util.randHex() + util.randHex() + util.randHex() + util.randHex() + util.randHex() + util.randHex() + util.randHex() + util.randHex() + util.randHex() + 
    util.randHex() + util.randHex() + util.randHex();
    return ret;
  };
  util.btoa = function(input) {
    if (typeof btoa != "undefined") {
      return btoa(input);
    } else {
      var str = String(input);
      var block;
      var charCode;
      var idx = 0;
      var map = util.chars;
      var output = "";
      for (; str.charAt(idx | 0) || (map = "\x3d", idx % 1); output = output + map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = str.charCodeAt(idx = idx + 3 / 4);
        if (charCode > 255) {
          throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
      }
      return output;
    }
  };
  util.atob = function(input) {
    if (typeof atob != "undefined") {
      return atob(input);
    } else {
      var str = String(input).replace(/=+$/, "");
      if (str.length % 4 == 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      var bc = 0;
      var bs;
      var buffer;
      var idx = 0;
      var output = "";
      for (; buffer = str.charAt(idx++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output = output + String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        buffer = util.chars.indexOf(buffer);
      }
      return output;
    }
  };
  util.Uint8ToBase64 = function(u8Arr) {
    var CHUNK_SIZE = 32768;
    var index = 0;
    var length = u8Arr.length;
    var result = "";
    var slice = null;
    for (; index < length;) {
      slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
      result = result + String.fromCharCode.apply(null, slice);
      index = index + CHUNK_SIZE;
    }
    return util.btoa(result);
  };
  util.Base64ToUint8 = function(base64) {
    var binary_string = util.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    var i = 0;
    for (; i < len; i++) {
      var ascii = binary_string.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  };
});

//# sourceMappingURL=com.cognitect.transit.util.js.map
