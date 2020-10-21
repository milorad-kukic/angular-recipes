import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {

  /* user = new BehaviorSubject<User>(null); */
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  signup(email: string, first_name: string, last_name: string,
         password: string) {
    return this.http.post(
      'http://localhost:8000/api/user/create/',
      {
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password
      }
    );
  }

  login(email: string, password: string) {
    return this.http.post<{token: string}>(
      'http://localhost:8000/api/user/token/',
      {
        email: email,
        password: password
      }
    ).pipe(
      tap(resData => {
        const user = new User(email, resData.token);
        /* this.user.next(user); */
        this.store.dispatch(new AuthActions.Login({
          email: email,
          token: resData.token
        }));
        // this.autoLogout(5000);
        localStorage.setItem('userData', JSON.stringify(user));
      }),
      catchError(error=> {
        var errorObject = error['error'];
        var errorMessage = 'Server Error';
        if (errorObject && errorObject['non_field_errors']) {
          errorMessage = errorObject['non_field_errors'][0]; 
        }

        return throwError(errorMessage)
      })
    );
  }

  autoLogin() {
    const userData: {
      email: string;
      _token: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData._token)

    if (loadedUser.token) {
      /* this.user.next(loadedUser); */
      this.store.dispatch(new AuthActions.Login({
        email: loadedUser.email, 
        token: loadedUser.token
      }));
    }
  }

  logout() {
    /* this.user.next(null); */
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  
  }

}
