// import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import * as auth0 from 'auth0-js';
// import { Router } from '@angular/router';
// import { from, Observable, throwError, BehaviorSubject, of, combineLatest } from 'rxjs';
// import { shareReplay, catchError, concatMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Create an observable of Auth0 instance of client
  userId: string;

  auth0Client$ = (from(
    createAuth0Client({
      domain: "kunzou.auth0.com",
      client_id: environment.authClientId,
      redirect_uri: environment.authRedirectUri
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError(err => throwError(err))
  );
  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap(res => this.loggedIn = res)
  );
  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
  );
  // Create subject and public observable of user profile data
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject$.asObservable();
  // Create a local property for login status
  loggedIn: boolean = null;

  constructor(private router: Router) {
    // On initial load, check authentication state with authorization server
    // Set up local auth streams if user is already authenticated
    this.localAuthSetup();
    // Handle redirect from Auth0 login
    this.handleAuthCallback();
  }

  // When calling, options can be passed if desired
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
  getUser$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => {
        this.userProfileSubject$.next(user);
        this.userId = user.sub;
      })
    );
  }

  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          // If authenticated, get user and set in app
          // NOTE: you could pass options here if needed
          return this.getUser$();
        }
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      })
    );
    checkAuth$.subscribe();
  }

  login(redirectPath: string = '/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: `${window.location.origin}`,
        appState: { target: redirectPath }
      });
    });
  }

  private handleAuthCallback() {
    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap(cbRes => {
          // Get and set target redirect route from callback results
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$
          ]);
        })
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(([user, loggedIn]) => {
        // Redirect to target route after callback processing
        this.router.navigate([targetRoute]);
      });
    }
  }

  logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: "YOUR_CLIENT_ID",
        returnTo: `${window.location.origin}`
      });
    });
  }

}

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   auth0 = new auth0.WebAuth({
//     clientID: environment.authClientId,
//     domain: 'kunzou.auth0.com',
//     responseType: 'token',
//     redirectUri: environment.authRedirectUri,
//     scope: 'openid'
//   });

//   accessToken: string;
//   expiresAt: Number;
//   userId: string;
//   userEmail: string;

//   constructor(public router: Router) {}

//   public login(): void {
//     this.auth0.authorize();
//   }

//   public handleAuthentication(): void {
//     this.auth0.parseHash((err, authResult) => {
//       if (authResult && authResult.accessToken) {
//         window.location.hash = '';
//         this.accessToken = authResult.accessToken;
//         this.expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
//         this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
//           // Now you have the user's information
//           this.setUserId();
//         });        
//         this.router.navigate(['/welcome']);
//       } else if (err) {
//         this.router.navigate(['/']);
//         console.log(err);
//       }
//     });
//   }

//   setUserId(userId: string) {
//     this.userId = userId;
//   }

//   public logout(): void {
//     // Remove tokens and expiry time from localStorage
//     this.accessToken = null;
//     this.expiresAt = null;
//     // Go back to the home route
//     this.router.navigate(['/']);
//   }

//   public isAuthenticated(): boolean {
//     // Check whether the current time is past the
//     // Access Token's expiry time
//     return new Date().getTime() < this.expiresAt;
//   }
// }
