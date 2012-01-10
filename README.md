This is the Cryptofox add-on.  It contains:

* A program (lib/main.js).
* A few tests.
* Some meager documentation.

Requirements
------------
GnuPG
libgpgme11 

Troubleshooting
---------------
If you are on 64-bit linux, but running a 32-bit firefox, you may run into the issue where the libs cannot be loaded. If this is the case, you need to use getlibs to install the 32-bit versions. For example, if gpgme cannot be loaded, you might do:

Install the 32-bit version:
$ sudo getlibs -p libgpgme11

Make a symlink from the library to the name the plugin is looking for:
$ cd /usr/lib32
$ sudo ln -s libgpgme.so.11 libgpgme.so 
