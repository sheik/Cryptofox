var cm = require("context-menu")
var selection = require("selection")

/* import ctypes */
const {Cu} = require("chrome");
Components.utils.import("resource://gre/modules/ctypes.jsm");

var cryptofox = ctypes.open("/root/Projects/Cryptofox/cryptofox-lib/libcryptofox.so.1.0.1");

var encrypt = cryptofox.declare("encrypt", ctypes.default_abi, ctypes.void_t, ctypes.char.ptr, ctypes.char.ptr, ctypes.char.ptr);
var read_data = cryptofox.declare("read_data", ctypes.default_abi, ctypes.int, ctypes.char.ptr, ctypes.int);

var cstring = ctypes.ArrayType(ctypes.char);
var gpg_result = new cstring(512);
var encrypted = new String();

cm.Item({
    label: "Encrypt with GPG",
    context: cm.SelectionContext(),
    contentScript: 'self.on("click", function(node,data) {' +
                   '    self.postMessage("encrypt");' +
                   '});',
    onMessage: function(item) {
                   encrypted = "";
                   encrypt(selection.text,gpg_result,"3092E1F07FD60C4AF7DCC04EC5B70FF2C35F1F8E");
                   var res = 1;
                   while(res == 1) {
                        res = read_data(gpg_result, 512);
                        encrypted = encrypted + gpg_result.readString();
                   }
                   selection.text = encrypted;
               }
});

