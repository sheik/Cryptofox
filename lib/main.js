var cm = require("context-menu");
var selection = require("selection");
var s = require("self");

/* import ctypes */
const {Cu} = require("chrome");
Components.utils.import("resource://gre/modules/ctypes.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");

var cryptofox = null;

AddonManager.getAddonByID(s.id, function(addon) {
        var libraryLocation = addon.getResourceURI("libcryptofox.so").QueryInterface(Components.interfaces.nsIFileURL).file.path;
        cryptofox = ctypes.open(libraryLocation);
});

var encrypt = cryptofox.declare("encrypt", ctypes.default_abi, ctypes.void_t, ctypes.char.ptr, ctypes.char.ptr, ctypes.char.ptr);
var read_data = cryptofox.declare("read_data", ctypes.default_abi, ctypes.int, ctypes.char.ptr, ctypes.int);
var init_keylist = cryptofox.declare("init_keylist", ctypes.default_abi, ctypes.void_t);
var get_next_key = cryptofox.declare("get_next_key", ctypes.default_abi, ctypes.int, ctypes.char.ptr, ctypes.int);

var cstring = ctypes.ArrayType(ctypes.char);
var gpg_result = new cstring(512);
var encrypted = new String();
var ckey = new cstring(512);
var key = new String();

cm.Item({
    label: "Encrypt with GPG",
    context: cm.SelectionContext(),
    contentScript: 'self.on("click", function(node,data) {' +
                   '    self.postMessage("encrypt");' +
                   '});',
    onMessage: function(item) {
                   init_keylist();
                   var res = 1;
                   while(res == 1) {
                       res = get_next_key(ckey, 512);
                       console.log(ckey.readString());
                   }
                   
                   encrypted = "";
                   encrypt(selection.text,gpg_result,"3092E1F07FD60C4AF7DCC04EC5B70FF2C35F1F8E");
                   res = 1;
                   while(res == 1) {
                        res = read_data(gpg_result, 512);
                        encrypted = encrypted + gpg_result.readString();
                   }
                   selection.text = encrypted;
               }
});

