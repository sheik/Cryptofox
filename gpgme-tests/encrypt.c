#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#include <gpgme.h>

#include "t-support.h"

int main (int argc, char *argv[])
{
	gpgme_ctx_t ctx;
	gpgme_error_t err;
	gpgme_data_t in, out;
	gpgme_key_t key[3] = { NULL, NULL, NULL };
	gpgme_encrypt_result_t result;

	init_gpgme (GPGME_PROTOCOL_OpenPGP);

	err = gpgme_new (&ctx);
	fail_if_err (err);
	gpgme_set_armor (ctx, 1);

	err = gpgme_data_new_from_mem (&in, "So long and thanks for all the fish\n", 36, 0);
	fail_if_err (err);

	err = gpgme_data_new (&out);
	fail_if_err (err);

	// my key (jeff@grid32.com)
	err = gpgme_get_key (ctx, "3092E1F07FD60C4AF7DCC04EC5B70FF2C35F1F8E",
			&key[0], 0);
	fail_if_err (err);

	err = gpgme_get_key(ctx,"C0C13F91F6F111E8C66CA6E518A66F16FBFD6A72",
			&key[1], 0);
	fail_if_err (err);

	err = gpgme_op_encrypt (ctx, key, GPGME_ENCRYPT_ALWAYS_TRUST, in, out);
	fail_if_err (err);
	result = gpgme_op_encrypt_result (ctx);
	if (result->invalid_recipients)
	{
		fprintf (stderr, "Invalid recipient encountered: %s\n",
				result->invalid_recipients->fpr);
		exit (1);
	}
	print_data (out);

	gpgme_key_unref (key[0]);
	gpgme_key_unref (key[1]);
	gpgme_data_release (in);
	gpgme_data_release (out);
	gpgme_release (ctx);
	return 0;
}
