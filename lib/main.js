/* import ctypes */
const {Cu} = require("chrome");
Components.utils.import("resource://gre/modules/ctypes.jsm");

var cryptofox = ctypes.open("/root/Projects/Cryptofox/cryptofox-lib/libcryptofox.so.1.0.1");

var test_lib = cryptofox.declare("test_lib", ctypes.default_abi, ctypes.void_t, ctypes.char.ptr, ctypes.char.ptr);

var ret = test_lib("testing gpg through firefox","3092E1F07FD60C4AF7DCC04EC5B70FF2C35F1F8E");

cryptofox.close();
console.log("The add-on is running.");
