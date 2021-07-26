## GlobalProtect VPN / Openconnect with SSO/SAML

### Dependencies

- OpenSSL
- NodeJS >= 12

```bash
sudo apt-get install \
    python3 build-essential gettext autoconf automake libproxy-dev \
    libxml2-dev libtool vpnc-scripts pkg-config zlib1g-dev \
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
  npm install

  # Connect to VPN
  npm connect
```

Forked from https://gitlab.com/openconnect/openconnect
