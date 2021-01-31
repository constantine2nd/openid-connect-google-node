# Google OpenID Connect using Node.js

This is the Node.js web application showing how to configure and enable OpenID Connect middleware in case of Google as the Identity Provider using Express web framework, [Passport](https://github.com/jaredhanson/passport) authentication middleware and [openid-client](https://github.com/panva/node-openid-client).

[Demostration video](https://drive.google.com/file/d/1VVzDMtnmDQSFK1XJrBz6mSkVsUzp4gNE/view?usp=sharing)

## Running the app

Run `npm install` to install all dependencies.

Run `npm start` to start the server.

You can access the app on [http://localhost:3000](http://localhost:3000).

Please do not forget to set up client id and secret in file `app.js`:
```
client_id: 'YOUR_CLIENT_ID',
client_secret: 'YOUR_CLIENT_SECRET',
```
In case do do not have it you can use https://console.developers.google.com to create one and tweak a consent screen as well.

# openid-connect-google-node
