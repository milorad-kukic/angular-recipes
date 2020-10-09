import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

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
  }

}
