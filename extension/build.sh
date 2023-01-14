#!/bin/sh
rm dist/jwt-inspector.zip
zip dist/jwt-inspector.zip * -D -x build.sh
