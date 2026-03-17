#!/bin/sh

echo "Removing SRSEII Magnetartikel WebUI..."

rm -rf /www/srseii
rm -f /www/cgi-bin/loadMagnetartikel
rm -f /www/cgi-bin/saveMagnetartikel

echo "Removed."