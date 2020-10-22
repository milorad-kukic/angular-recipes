import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { User } from '../user.model';

@Injectable()
export class AuthEffects {
  
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post(
        'http://localhost:8000/api/user/create/',
        {
          email: signupAction.payload.email,
          first_name: signupAction.payload.first_name,
          last_name: signupAction.payload.last_name,
          password: signupAction.payload.password
        }
      ).pipe(

      );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      
        return this.http.post<{token: string}>(
          'http://localhost:8000/api/user/token/',
          {
            email: authData.payload.email,
            password: authData.payload.password
          }
        ).pipe(
          map(resData=>{
            const user = new User(authData.payload.email, resData.token);
            localStorage.setItem('userData', JSON.stringify(user));
            return new AuthActions.AuthenticateSuccess({
              email: authData.payload.email, 
              token: resData.token
            })
          }),
          catchError(error => {
            var errorObject = error['error'];
            var errorMessage = 'Server Error';
            if (errorObject && errorObject['non_field_errors']) {
              errorMessage = errorObject['non_field_errors'][0]; 
            }
            return of(new AuthActions.AuthenticateFail(errorMessage));
          }), 
        );
      })
    );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(
      AuthActions.AUTHENTICATE_SUCCESS), 
    tap(()=>{
      this.router.navigate(['/']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(()=> {
      const userData: {
        email: string;
        _token: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'AUTO_LOGIN_FAIL' }
      }

      const loadedUser = new User(userData.email, userData._token)

      if (loadedUser.token) {
        /* this.user.next(loadedUser); */
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email, 
          token: loadedUser.token
        });
      }

      return { type: 'AUTO_LOGIN_FAIL' }
    })
  )
  
  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(()=> {
    localStorage.removeItem('userData'); 
    this.router.navigate(['/login']);
  }));

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}

}
