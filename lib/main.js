/* import ctypes */
const {Cu} = require("chrome");
Components.utils.import("resource://gre/modules/ctypes.jsm");

/* Open libc */
try {
    /* Linux */
    var libc = ctypes.open("libc.so.6");
} catch(e) {
    /* Most other Unixes */
    libc = ctypes.open("libc.so");
}

/* Open gpg error */
try {
    var gpgerror = ctypes.open(ctypes.libraryName("gpg-error"));
} catch(e) {
    console.log("Error loading gpg-error library");
}

/* Open gpgme */

try {
    var gpgme = ctypes.open(ctypes.libraryName("gpgme"));
} catch(e) {
    console.log("Error loading gpgme library");
}

var puts = libc.declare("puts",
                       ctypes.default_abi,
                       ctypes.int,
                       ctypes.char.ptr);

var ret = puts("Hello World from jsctypes!");


gpgerror.close();
gpgme.close();
libc.close();
console.log("The add-on is running.");
