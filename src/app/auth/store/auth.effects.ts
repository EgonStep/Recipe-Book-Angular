import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

/** Effects are to handle all side effects codes (like http's requests)
* npm install --save @ngrx/effects
*/
@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START)
  );

  @Effect() // Ongoing Observable Stream
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START), // ofType: Only continue this observable chain if type is Login Start
    switchMap((authData: AuthActions.LoginStart) => { // switchMap: Allow us to create a new observable
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
          map(
            resData => {
              const expirationDate = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );

              return new AuthActions.AuthenticateSuccess({email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate});
            }
          ),
          catchError(errorResponse => { // On NgRx Effect, catchError MUST return an non-error observable. This prevent we kill the ongoing observable stream
            let errorMessage = 'An unknown error occurred!';

            if (!errorResponse.error || !errorResponse.error.error) {
              return of(new AuthActions.AuthenticateFail(errorMessage));
            }

            switch(errorResponse.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
              break;
              case 'INVALID_PASSWORD':
              case 'EMAIL_NOT_FOUND':
                errorMessage = 'Login or Password not found';
              break;
            }
            return of(new AuthActions.AuthenticateFail(errorMessage));
          }
        )
      );
    })
  );

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly router: Router
  ) { }
}
