# Nozee JWT

Nozee JWT is an adapted version of JWT Inspector that is tailored for Nozee.

# JWT Inspector

JWT Inspector is a Chrome extension which makes it easy to inspect the content of
any JWT bearer token sent by a webapp.

The extension adds a new **JWT** tab in Chrome's Developer Tools.
When the tab is open, the extension inspects all server requests and picks out
the token from any request which has an `Authorization` header containing a JWT
bearer token.

You can [install the extension from chrome web store](https://chrome.google.com/webstore/detail/jwt-inspector/jgjihoodklabhdoeffdjofnknfijolgk)
or read more on [bugjam.github.io/jwt-inspector/](https://bugjam.github.io/jwt-inspector/).

# Development

The main implementation file is `jwt-panel.js`.

You can install the extension as "unpacked" straight from the source directory to
directly test any changes you make. (Enable "Developer mode" in
[chrome://extensions/](chrome://extensions/)
to make this option available.)

Running `build.sh` packages the extension for upload to the chrome web store.
Don't forget to change the version number in `manifest.json` before creating the package.
