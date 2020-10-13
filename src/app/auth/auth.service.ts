import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

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
      'http://localhost:8000/api/token/',
      {
        username: email,
        password: password
      }
    ).pipe(
      tap(resData => {
        const user = new User(email, resData.token);
        this.user.next(user);
        // this.autoLogout(5000);
        localStorage.setItem('userData', JSON.stringify(user));
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
      this.user.next(loadedUser);
    }
  }

  logout() {
    this.user.next(null);
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
