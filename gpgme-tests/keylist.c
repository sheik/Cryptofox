/* We need to include config.h so that we know whether we are building
   with large file system (LFS) support. */
#ifdef HAVE_CONFIG_H
#include <config.h>
#endif

#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#include <gpgme.h>

#include "t-support.h"


int 
main (int argc, char **argv)
{
     gpgme_ctx_t ctx;
     gpgme_key_t key;
     gpgme_error_t err;

     init_gpgme (GPGME_PROTOCOL_OpenPGP);
     err = gpgme_new(&ctx);

     if (!err)
       {
           printf("trying to list keys\n");
         err = gpgme_op_keylist_start (ctx, "", 0);
         while (!err)
           {
             err = gpgme_op_keylist_next (ctx, &key);
             if (err)
               break;
             printf ("%s:", key->subkeys->keyid);
             printf (" (%s)", key->subkeys->fpr);
             if (key->uids && key->uids->name)
               printf (" %s", key->uids->name);
             if (key->uids && key->uids->email)
               printf (" <%s>", key->uids->email);
             putchar ('\n');
             gpgme_key_release (key);
           }
         gpgme_release (ctx);
       }
     if (gpg_err_code (err) != GPG_ERR_EOF)
       {
         fprintf (stderr, "can not list keys: %s\n", gpgme_strerror (err));
         exit (1);
       }
}

