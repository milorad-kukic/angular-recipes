import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage: string = null;
  isLoading = false;

  @ViewChild('loginForm', { static: false}) loginForm;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading; 
      this.errorMessage = authState.authError;
    })    
  }

  onLogin() {
    const email = this.loginForm.value['email'];
    const password = this.loginForm.value['password'];
    this.store.dispatch(new AuthActions.LoginStart({
      email: email,
      password: password
    }));


    /* console.log(this.loginForm); */
    /* this.isLoading = true; */
    /* this.authService.login(email, password) */
    /*   .subscribe( */
    /*     responseData => { */
    /*       console.log(responseData); */
    /*       this.isLoading = false; */
    /*       this.router.navigate(['/recipes']); */
    /*     }, */
    /*     errorData => { */
    /*       this.errorMessage = errorData; */
    /*       console.log(errorData); */
    /*       this.isLoading = false; */
    /*     } */
    /*   ) */
  }

  onHandleError() {
    this.errorMessage = null;
  }

}

