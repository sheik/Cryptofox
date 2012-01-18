#!/bin/bash

cd /opt/addon-sdk-1.3/
source bin/activate
cd ~
cd Projects/Cryptofox
cfx --no-strip-xpi xpi
