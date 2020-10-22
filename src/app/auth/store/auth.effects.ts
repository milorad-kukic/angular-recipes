import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';

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
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT), 
    tap(()=>{
    this.router.navigate(['/']);
  }));

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}

}
