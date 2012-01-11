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

/** context struct
  * defined in context.h
  * NOT YET COMPLETE
  */
const gpgme_context = new ctypes.StructType("gpgme_context",
		[
			// DECLARE_LOCK (lock);
			{ "canceled":		ctypes.int },
			// gpgme_engine_info_t engine_info;
			// gpgme_protocol_t protocol;
			// engine_t engine;
			// gpgme_protocol_t sub_protocol;
			{ "use_armor":		ctypes.unsigned_int },		// default 1
			{ "use_textmode":	ctypes.unsigned_int },		// default 1
			// gpgme_keylist_mode_t keylist_mode;
			{ "include_certs":	ctypes.unsigned_int },
			{ "signers_len":	ctypes.unsigned_int },
			{ "signers_size":	ctypes.unsigned_int },
			// gpgme_key_t *signers;
			// gpgme_sig_notation_t sig_notations;
			{ "lc_ctype":		ctypes.char.ptr },
			{ "lc_message":		ctypes.char.ptr },
			// ctx_op_data_t op_data;
			// gpgme_passphrase_cb_t passphrase_cb;
			{ "passphrase_cb_value": ctypes.voidptr_t },
			// gpgme_progress_cb_t progress_cb;
			{ "progress_cb_value": ctypes.voidptr_t }
			// struct fd_table fdt;
			// struct gpgme_io_cbs io_cbs;
		]);

/* Move these to run only when plugin is deactivated */
gpgme.close();
libc.close();
console.log("The add-on is running.");
