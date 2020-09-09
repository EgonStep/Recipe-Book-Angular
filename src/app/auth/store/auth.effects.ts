import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from '../auth.service';


export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(
    new Date().getTime() + expiresIn * 1000
  );
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({email, userId, token, expirationDate, redirect: true});
};

const handleError = (errorResponse: any) => {
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
};

/** Effects are to handle all side effects codes (like http's requests)
* npm install --save @ngrx/effects
*/
@Injectable()
export class AuthEffects {

  @Effect() // Ongoing Observable Stream
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START), // ofType: Only continue this observable chain if type is Signup Start
    switchMap((signupAction: AuthActions.SignupStart) => { // switchMap: Allow us to create a new observable
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(respData => {
          this.authService.setLogoutTimer(+respData.expiresIn * 1000);
        }),
        map(
          resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }
        ),
        catchError(errorResponse => { // On NgRx Effect, catchError MUST return an non-error observable. This prevent we kill the ongoing observable stream
          return handleError(errorResponse);
        }
      )
    );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
          tap(respData => {
            this.authService.setLogoutTimer(+respData.expiresIn * 1000);
          }),
          map(
            resData => {
              return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }
          ),
          catchError(errorResponse => {
            return handleError(errorResponse);
          }
        )
      );
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      this.router.navigate(['/auth'])
      localStorage.removeItem('userData');
    })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: Date
      } = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        return { type: 'DUMMY'};
      }

      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

      if (loadedUser.token) {
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        });
      }
      return { type: 'DUMMY'};
    })
  );

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }
}
