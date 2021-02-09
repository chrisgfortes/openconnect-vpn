## GlobalProtect VPN / Openconnect with SSO/SAML

### Dependencies

```bash
sudo apt-get install \
    python3 build-essential gettext autoconf automake libproxy-dev \
    libxml2-dev libtool vpnc-scripts pkg-config \
    libgnutls-dev # may be named libgnutls28-dev on some recent Debian/Ubuntu-based distros
```

## Environment configuration (.env)

```script
LOGIN_USERNAME=
LOGIN_PASSWORD=
VPN_PORTAL=
VPN_LOGIN_URL=
```

### Using

```bash
  # Install dependencies
  yarn install

  # Connect to VPN
  yarn connect
```

Forked from https://gitlab.com/openconnect/openconnect
