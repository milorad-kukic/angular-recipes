import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, RequiredValidator, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../login/login.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email:  new FormControl(null, [Validators.required, Validators.email]),
      first_name: new FormControl(),
      last_name: new FormControl(),
      password1: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required)
    })
  }

  onSignup() {
    const email = this.signupForm.value.email;
    const first_name = this.signupForm.value.first_name ? this.signupForm.value.first_name : '';
    const last_name = this.signupForm.value.last_name ? this.signupForm.value.last_name : '';
    const password = this.signupForm.value.password1;
    this.authService.signup(email, first_name, last_name, password)
      .subscribe(
        result => {
          console.log(result);
          this.router.navigate(['/login']);
        },
        error => {
          let obj = error['error']; 
          this.errorMessage = obj[Object.keys(obj)[0]][0];
          console.log(this.errorMessage);
        }
      )


  }

}
