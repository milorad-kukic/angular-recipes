import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {

  errorMessage: string = null;
  isLoading = false;

  @ViewChild('loginForm', { static: false}) loginForm;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    const email = this.loginForm.value['email'];
    const password = this.loginForm.value['password'];
    console.log(this.loginForm);
    this.isLoading = true;
    this.authService.login(email, password)
      .subscribe(
        responseData => {
          console.log(responseData);
          this.isLoading = false;
          this.router.navigate(['/recipes']);
        },
        errorData => {
          this.errorMessage = errorData;
          console.log(errorData);
          this.isLoading = false;
        }
      )
  }

  onHandleError() {
    this.errorMessage = null;
  }

}

