#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#include <gpgme.h>

#include "cryptofox.h"

#include "t-support.h"

gpgme_data_t _cf_out;
gpgme_ctx_t _cf_ctx;
gpgme_error_t _cf_err;

void init_cryptofox() {
	init_gpgme (GPGME_PROTOCOL_OpenPGP);
	_cf_err = gpgme_new (&_cf_ctx);
	fail_if_err (_cf_err);
}

void init_keylist() {
    init_cryptofox();
    _cf_err = gpgme_op_keylist_start(_cf_ctx, "", 0);
    fail_if_err(_cf_err);
}

int get_next_key(char *buf, int buf_size) {
    gpgme_key_t key;
    int tmp_size = buf_size - 1;

    _cf_err = gpgme_op_keylist_next (_cf_ctx, &key);

    if(!_cf_err) {
        strcpy(buf,"");

        /* copy fingerprint and add ":" at the end */
        strncat(buf, key->subkeys->fpr, tmp_size);
        tmp_size -= strlen(key->subkeys->fpr) - 1; /* subtract 1 for the ":" character */
        strncat(buf, ":", tmp_size);

        /* Try to copy name */
        if (key->uids && key->uids->name) {
            strncat(buf, key->uids->name, tmp_size);
            tmp_size -= strlen(key->uids->name);
        }

        /* Try to copy email */
        if (key->uids && key->uids->email) {
            strncat(buf, " <", tmp_size);
            tmp_size -= 2;
            strncat(buf, key->uids->email, tmp_size);
            tmp_size -= strlen(key->uids->email);
            strncat(buf, ">", tmp_size);
            tmp_size -= 1;
        }

        gpgme_key_release (key);
        return 1;
    } else {
        gpgme_release(_cf_ctx);
        return 0;
    }
}

void encrypt(const char *message, char *dest, const char *fingerprint)
{
	gpgme_data_t in;
	gpgme_key_t key[2] = { NULL, NULL };
	gpgme_encrypt_result_t result;

    init_cryptofox();

	gpgme_set_armor (_cf_ctx, 1);

	_cf_err = gpgme_data_new_from_mem (&in, message, strlen(message), 0);
	fail_if_err (_cf_err);

	_cf_err = gpgme_data_new (&_cf_out);
	fail_if_err (_cf_err);

	// my key (jeff@grid32.com)
	_cf_err = gpgme_get_key (_cf_ctx, fingerprint,
			&key[0], 0);
	fail_if_err (_cf_err);

//	err = gpgme_get_key(ctx,"C0C13F91F6F111E8C66CA6E518A66F16FBFD6A72",
//			&key[1], 0);
//	fail_if_err (err);

	_cf_err = gpgme_op_encrypt (_cf_ctx, key, GPGME_ENCRYPT_ALWAYS_TRUST, in, _cf_out);
	fail_if_err (_cf_err);
	result = gpgme_op_encrypt_result (_cf_ctx);
	if (result->invalid_recipients)
	{
		fprintf (stderr, "Invalid recipient encountered: %s\n",
				result->invalid_recipients->fpr);
		exit (1);
	}

    int ret;
    ret = gpgme_data_seek(_cf_out, 0, SEEK_SET);
    if(ret)
        fail_if_err(gpgme_err_code_from_errno(errno));

	gpgme_key_unref (key[0]);
	gpgme_data_release (in);
	gpgme_release (_cf_ctx);
}

int read_data(char *buf, int buf_size) {
    int ret;
    strcpy(buf,"");

    if((ret = gpgme_data_read(_cf_out, buf, buf_size)) > 0)
        buf[ret] = '\0';

    if(ret < 0)
        fail_if_err(gpgme_err_code_from_errno(errno));

    if(ret > 0) {
        return 1;
    } else {
        gpgme_data_release(_cf_out);
        return 0;
    }
}

