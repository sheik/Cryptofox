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


/* from gpgme.h */
const GPGME_PROTOCOL_OpenPGP = ctypes.unsigned_int(0);
const GPGME_PROTOCOL_CMS     = ctypes.unsigned_int(1);
const GPGME_PROTOCOL_GPGCONF = ctypes.unsigned_int(2);
const GPGME_PROTOCOL_ASSUAN  = ctypes.unsigned_int(3);
const GPGME_PROTOCOL_G13     = ctypes.unsigned_int(4);
const GPGME_PROTOCOL_UISERVER= ctypes.unsigned_int(5);
const GPGME_PROTOCOL_DEFAULT = ctypes.unsigned_int(254);
const GPGME_PROTOCOL_UNKNOWN = ctypes.unsigned_int(255);

var _gpgme_engine_info = new ctypes.StructType("_gpgme_engine_info"); 
const gpgme_engine_info_t = new ctypes.PointerType(_gpgme_engine_info);
_gpgme_engine_info.define(
        [
            { "next":           gpgme_engine_info_t },
            { "protocol":       ctypes.unsigned_int },
            { "file_name":      ctypes.char.ptr },
            { "version":        ctypes.char.ptr },
            { "req_version":    ctypes.char.ptr },
            { "home_dir":       ctypes.char.ptr }

        ]);


/* from engine.h */
const engine = new ctypes.StructType("engine");
const engine_t = new ctypes.PointerType(engine);

/* from sema.h */
const critsect_s = new ctypes.StructType("critsect_s",
        [
            { "name":	ctypes.char.ptr },
            { "priv":	ctypes.voidptr_t }
        ]);



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
var ctx_op_data = ctypes.StructType("ctx_op_data");  /* required for the self-pointer "next" */
ctx_op_data.define(
        [
            { "magic": ctypes.unsigned_long_long },
            { "type": ctypes.unsigned_int },	// ctx_op_data_id_t
            { "next": ctx_op_data.ptr },
            { "cleanup": ctypes.FunctionType(ctypes.default_abi, ctypes.voidptr_t).ptr }, // not sure if right
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
            { "lock":           critsect_s },
            { "canceled":		ctypes.int },
            { "engine_info":    gpgme_engine_info_t },
            { "protocol":       ctypes.unsigned_int },
            { "engine":         engine_t },
            { "sub_protocol":   ctypes.unsigned_int },
            { "use_armor":		ctypes.unsigned_int },		// default 1
            { "use_textmode":	ctypes.unsigned_int },		// default 1
            { "keylist_mode":   ctypes.unsigned_int },      // gpgme_keylist_mode_t
            { "include_certs":	ctypes.unsigned_int },
            { "signers_len":	ctypes.unsigned_int },
            { "signers_size":	ctypes.unsigned_int },
            // gpgme_key_t *signers;
            // gpgme_sig_notation_t sig_notations;
            { "lc_ctype":		ctypes.char.ptr },
            { "lc_message":		ctypes.char.ptr },
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

