// import ctypes
const {Cu} = require("chrome");
Components.utils.import("resource://gre/modules/ctypes.jsm");

var libc = ctypes.open("libc.so.6");

var puts = libc.declare("puts",
                       ctypes.default_abi,
                       ctypes.int,
                       ctypes.char.ptr);

var ret = puts("Hello World from jsctypes!");

console.log("The add-on is running.");
