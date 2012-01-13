#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#include <gpgme.h>

#include "t-support.h"

gpgme_data_t out;

void encrypt(const char *message, char *dest, const char *fingerprint)
{
	gpgme_ctx_t ctx;
	gpgme_error_t err;
	gpgme_data_t in;
	gpgme_key_t key[2] = { NULL, NULL };
	gpgme_encrypt_result_t result;

	init_gpgme (GPGME_PROTOCOL_OpenPGP);

	err = gpgme_new (&ctx);
	fail_if_err (err);
	gpgme_set_armor (ctx, 1);

	err = gpgme_data_new_from_mem (&in, message, strlen(message), 0);
	fail_if_err (err);

	err = gpgme_data_new (&out);
	fail_if_err (err);

	// my key (jeff@grid32.com)
	err = gpgme_get_key (ctx, fingerprint,
			&key[0], 0);
	fail_if_err (err);

//	err = gpgme_get_key(ctx,"C0C13F91F6F111E8C66CA6E518A66F16FBFD6A72",
//			&key[1], 0);
//	fail_if_err (err);

	err = gpgme_op_encrypt (ctx, key, GPGME_ENCRYPT_ALWAYS_TRUST, in, out);
	fail_if_err (err);
	result = gpgme_op_encrypt_result (ctx);
	if (result->invalid_recipients)
	{
		fprintf (stderr, "Invalid recipient encountered: %s\n",
				result->invalid_recipients->fpr);
		exit (1);
	}

    int ret;
    ret = gpgme_data_seek(out, 0, SEEK_SET);
    if(ret)
        fail_if_err(gpgme_err_code_from_errno(errno));

	gpgme_key_unref (key[0]);
	gpgme_data_release (in);
	gpgme_release (ctx);
}

int read_data(char *buf, int buf_size) {
    int ret;
    strcpy(buf,"");

    if((ret = gpgme_data_read(out, buf, buf_size)) > 0)
        buf[ret] = '\0';

    if(ret < 0)
        fail_if_err(gpgme_err_code_from_errno(errno));

    return (ret > 0 ? 1: 0);
}

void free_data() {
    gpgme_data_release(out);
}
