export const environment = {
  production: true,
  baseUrl: 'http://kunzou.me',
  auth: {
    clientID: 'pCb7m5IPa62ZpWC3gMkuDu54drA98BZs',
    domain: 'kunzou.auth0.com',
    audience: 'https://kunzou.auth0.com/api/v2/',
    redirect: 'http://kunzou.me/callback',
    scope: 'openid profile email'
  }
};