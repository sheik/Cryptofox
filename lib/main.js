var cm = require("context-menu")
var selection = require("selection")

/* import ctypes */
const {Cu} = require("chrome");
Components.utils.import("resource://gre/modules/ctypes.jsm");

var cryptofox = ctypes.open("/root/Projects/Cryptofox/cryptofox-lib/libcryptofox.so.1.0.1");

var test_lib = cryptofox.declare("test_lib", ctypes.default_abi, ctypes.void_t, ctypes.char.ptr, ctypes.char.ptr, ctypes.char.ptr);

var stringType = ctypes.ArrayType(ctypes.char);
var gpg_result = new stringType(2048*2048);

cm.Item({
    label: "Encrypt with GPG",
    context: cm.SelectionContext(),
    contentScript: 'self.on("click", function(node,data) {' +
                   '    var text = window.getSelection().toString();' +
                   '    self.postMessage(text);' +
                   '});',
    onMessage: function(item) {
                   test_lib(item,gpg_result,"3092E1F07FD60C4AF7DCC04EC5B70FF2C35F1F8E");
                   selection.text = gpg_result.readString();
               }
});

console.log("The add-on is running.");
