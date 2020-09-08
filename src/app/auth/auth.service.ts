import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../shared/models/user.model';

import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable()
export class AuthService {

  private tokenExpirationTimer: any;

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<fromApp.AppState>
  ) { }

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.handleError),
      tap(respData => {
        this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn)
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.handleError),
      tap( respData => {
        this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn)
    }));
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  retrieveUserFromLocalStorage() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: Date
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.store.dispatch(new AuthActions.AuthenticateSuccess({
        email: loadedUser.email,
        userId: loadedUser.id,
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate)
      }));

      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.timeoutUserFromLocalStorage(expirationDuration);
    }
  }

  timeoutUserFromLocalStorage(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
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

    return throwError(errorMessage);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.store.dispatch(new AuthActions.AuthenticateSuccess({
      email,
      userId,
      token,
      expirationDate
    }));

    this.timeoutUserFromLocalStorage(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
