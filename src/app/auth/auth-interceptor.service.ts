import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private readonly authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Make sure to get the user only once, using rxjs 'take' method. It'll unsubscribe automatically.
    // Using rxjs 'exhaustMap' means that we will return the http observable after the user observable is completed.
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        // If we don't have the user login, just send the original request
        if (!user) {
          return next.handle(req);
        }

        const modifiedRequest = req.clone({
          params: new HttpParams().set('auth', user.token)
        });

        return next.handle(modifiedRequest);
      }));
  }
}
