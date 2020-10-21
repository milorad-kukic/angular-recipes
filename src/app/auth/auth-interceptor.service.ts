import { HttpHandler, HttpInterceptor, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { take, exhaustMap, map } from "rxjs/operators";
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /* return this.authService.user.pipe( */
    return this.store.select('auth').pipe(
      take(1),
      map(authState=> {
        return authState.user;
      }),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        const modifiedRequest = req.clone({
          headers: new HttpHeaders().set('Authorization', 'Token ' + user.token)
        });
        return next.handle(modifiedRequest);
      })
    );
  }

}
