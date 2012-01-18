#include <gpgme.h>

void init_cryptofox(void);
void init_keylist(void);
int get_next_key(char *buf, int buf_size);
void encrypt(const char *message, char *dest, const char *fingerprint);
int read_data(char *buf, int buf_size);
