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

## Install nodejs dependencies
```bash
  # Install dependencies
  yarn install
```

## Available commands

```script
yarn connect --help
yarn connect --reset (Reset .env file)
yarn connect --config (Show vpn config hidden password)
yarn connect --config-secure (Show vpn config showing password)
yarn connect --onclose="command" (run command when on close connection)
```

Forked from https://gitlab.com/openconnect/openconnect
