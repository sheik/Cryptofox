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

/* enum ctx_op_data_id_t */
const OPDATA_DECRYPT		= ctypes.unsigned_int(0);
const OPDATA_SIGN			= ctypes.unsigned_int(1);
const OPDATA_ENCRYPT		= ctypes.unsigned_int(2);
const OPDATA_PASSPHRASE		= ctypes.unsigned_int(3);
const OPDATA_IMPORT			= ctypes.unsigned_int(4);
const OPDATA_GENKEY			= ctypes.unsigned_int(5);
const OPDATA_KEYLIST		= ctypes.unsigned_int(6);
const OPDATA_EDIT			= ctypes.unsigned_int(7);
const OPDATA_VERIFY			= ctypes.unsigned_int(8);
const OPDATA_TRUSTLIST		= ctypes.unsigned_int(9);
const OPDATA_ASSUAN			= ctypes.unsigned_int(10);
const OPDATA_VFS_MOUNT		= ctypes.unsigned_int(11);
const OPDATA_PASSWD			= ctypes.unsigned_int(12);

/** ctx_op_data struct
  * defined in context.h
  * NOT YET COMPLETE
  */
const ctx_op_data = new ctypes.StructType("ctx_op_data",
		[
			{ "magic": ctypes.unsigned_long_long },
			{ "next": ctypes.int.ptr }, 		// should be pointer to ctx_op_data
			{ "type": ctypes.unsigned_int },	// ctx_op_data_id_t
			// void (*cleanup) (void *hook);
			{ "hook": ctypes.voidptr_t },
			{ "references": ctypes.int }
		]);

const ctx_op_data_t = new ctypes.PointerType(ctx_op_data);

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
			{ "op_data":		ctx_op_data_t },
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
