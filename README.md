# SRSEII Magnetartikel Web UI

A lightweight web-based interface to manage the `magnetartikel.cs2` configuration file on SRSEII systems.

This tool allows you to view, create, edit, and delete magnet articles (turnouts, signals, etc.) directly from your browser.

---

## Features

- View all magnet articles
- Create new articles
- Edit existing articles
- Delete articles
- Automatic ID assignment
- Search / filter functionality
- Automatic backup on save

---

## Requirements

- SRSEII
- Access via web browser

---

## Installation

SSH into your SRSEII device:

```bash
cd /tmp
wget https://github.com/danuvius92/Magnetartikel-WebUI/archive/refs/heads/main.zip
unzip main
cd srseii-magnetartikel-webui
sh install.sh
```

WEBUI available at:

`http://<SRSEII-IP>/srseii/magnetartikel.html`