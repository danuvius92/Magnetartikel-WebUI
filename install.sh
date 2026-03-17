#!/bin/sh

echo "Installing SRSEII Magnetartikel WebUI..."

mkdir -p /www/srseii
mkdir -p /www/cgi-bin

cp web/* /www/srseii/
cp web/icons/* /www/srseii/icons/
cp cgi/* /www/cgi-bin/

chmod +x /www/cgi-bin/loadMagnetartikel
chmod +x /www/cgi-bin/saveMagnetartikel

echo ""
echo "Installation complete."
echo ""
echo "Open in browser:"
echo "http://<SRSEII-IP>/srseii/magnetartikel.html"