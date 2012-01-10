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


/* Open gpgme */
try {
    var gpgme = ctypes.open(ctypes.libraryName("gpgme"));
} catch(e) {
    console.log("Error loading gpgme library (" +
	        ctypes.libraryName("gpgme") +
	        ")");
}

var puts = libc.declare("puts",
                       ctypes.default_abi,
                       ctypes.int,
                       ctypes.char.ptr);

var ret = puts("Hello World from jsctypes!");


/* Move these to run only when plugin is deactivated */
gpgme.close();
libc.close();
console.log("The add-on is running.");
