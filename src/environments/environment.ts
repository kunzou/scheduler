// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080',
  // authClientId: 'pCb7m5IPa62ZpWC3gMkuDu54drA98BZs',
  // authRedirectUri: 'http://localhost:4200'  
  auth: {
    clientID: 'pCb7m5IPa62ZpWC3gMkuDu54drA98BZs',
    domain: 'kunzou.auth0.com', // e.g., https://you.auth0.com/
    // audience: 'YOUR-AUTH0-API-IDENTIFIER', // e.g., http://localhost:3001
    redirect: 'http://localhost:4200/',
    scope: 'openid profile email'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.