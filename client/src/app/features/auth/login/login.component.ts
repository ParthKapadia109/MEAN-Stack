import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../service/auth.service';
// import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;
  submitted = false;
  message = "";
  class = "";
  errors : any = [];

  constructor(
    private authService : AuthService,
    private formBulider : FormBuilder,
    private router : Router,
    private cookieService: CookieService
  ) {
    
    const userIsLogging =  this.cookieService.get('USER_DATA');
    if(userIsLogging) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBulider.group({
      email : ['', Validators.required],
      password : ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    if(this.loginForm.invalid) { return false; }
    
    this.authService.authentication(this.loginForm.value).pipe(first()).subscribe({
      next : data => {
        const userData : any = data;
        if(userData.response) {
          this.setCookie(userData);
          this.message = userData.message;
          this.class = "alert-success";
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 3000);
        } else {
          this.message = userData.message;
          this.class = "alert-danger";
        }
      },
      error : error => {
        console.log(error);
      }
    });
  }

  setCookie(userObject) {
    this.cookieService.delete('USER_DATA');
    this.cookieService.delete('SESSION_TOKEN');
    // localStorage.removeItem('USER_DATA');
    let expire = new Date();
    var time = Date.now() + ((3600 * 1000) * 1);
    expire.setTime(time);
    const userDetail : any = {
      user_name : userObject.data.user_name,
      user_slug : userObject.data.user_slug
    };
    // localStorage.setItem('USER_DATA', JSON.stringify(userDetail));
    this.cookieService.set('USER_DATA', btoa(JSON.stringify(userObject.data)), expire);
    this.cookieService.set('CUSTOM_THEME', btoa(JSON.stringify(userObject.data.custom_theme)), expire);
    this.cookieService.set('SESSION_TOKEN', btoa(userObject.token), expire);
  }

  // checkDemoDataInData() {
  //   // if(environment.installtion) {
  //   // } else {
  //     // this.authService.demoData().pipe(first()).subscribe({
  //     //   next : next => {
  //     //     const res : any = next;
  //     //     console.log(res);
  //     //   },
  //     //   error : error => {
  //     //     console.log(error)
  //     //   }
  //     // })
  //   // }
  // }
}
