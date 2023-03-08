# JWT

A simple chrome extension to view the last used [JWT](https://tools.ietf.org/html/rfc7519).

## How it works?

It monitors the requests in each tab which have:

```
Authorization: Bearer JWT
```

HTTP header and caches the last used JWT. It also adds a page action to the Chrome toolbar. When the user clicks on it the information about cached request and JWT is shown in the pop-up like this:

![JWT Chrome Extension Pop-up Screenshot](JWTScreenshot.png)