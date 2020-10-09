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
      })
    );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
  }

}
