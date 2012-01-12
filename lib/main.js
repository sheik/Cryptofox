/* import ctypes */
const {Cu} = require("chrome");
Components.utils.import("resource://gre/modules/ctypes.jsm");

/* Open libc (probably don't need this) */
try {
    /* Linux */
    var libc = ctypes.open("libc.so.6");
} catch(e) {
    /* Most other Unixes */
    libc = ctypes.open("libc.so");
}


libc.close();
console.log("The add-on is running.");
