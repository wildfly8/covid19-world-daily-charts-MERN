const CLIENT_ID = process.env.CLIENT_ID || '0oagmb47kUmSn03934x6';
const ISSUER = process.env.ISSUER || 'https://dev-183843.okta.com/oauth2/default';
const OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;

export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: 'http://localhost:3000/implicit/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
    idps: [
      {type: 'Facebook', id: '0oaht8zisaHual3pB4x6'}
      ],
    idpDisplay: "PRIMARY",
  },
  resourceServer: {
    messagesUrl: 'http://localhost:3000/api/messages',
  },
};
