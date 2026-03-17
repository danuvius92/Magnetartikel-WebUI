include $(TOPDIR)/rules.mk

PKG_NAME:=srseii-magnetartikel-webui
PKG_VERSION:=1.0

include $(INCLUDE_DIR)/package.mk

define Package/srseii-magnetartikel-webui
  SECTION:=srseii
  CATEGORY:=SRSEII
  TITLE:=SRSEII Magnetartikel Web UI
endef

define Package/srseii-magnetartikel-webui/install

    $(INSTALL_DIR) $(1)/www/srseii
    $(INSTALL_DIR) $(1)/www/cgi-bin

    $(INSTALL_BIN) ./cgi/loadMagnetartikel $(1)/www/cgi-bin/
    $(INSTALL_BIN) ./cgi/saveMagnetartikel $(1)/www/cgi-bin/

    $(INSTALL_DATA) ./web/* $(1)/www/srseii/

endef

$(eval $(call BuildPackage,srseii-magnetartikel-webui))