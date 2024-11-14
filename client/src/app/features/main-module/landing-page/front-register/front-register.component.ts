import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { CmsService } from 'src/app/service/cms.service';

@Component({
  selector: 'app-front-register',
  templateUrl: './front-register.component.html',
  styleUrls: ['./front-register.component.css']
})
export class FrontRegisterComponent implements OnInit {

  register_form : FormGroup;
  message = "";
  submitted = false;
  userNameError = "";
  emailError = "";
  passwordError = "";
  
  CMSData : any = []
  CMSDetails : any = []
  CMS_slug = ""

  emailPattern = "^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(
    private fb : FormBuilder,
    private authService : AuthService,
    private cmsService : CmsService,
    private router : Router,
    private cookieService: CookieService,
    private actRoute : ActivatedRoute


  ) { }

  ngOnInit(): void {
    this.register_form = this.fb.group({
      user_name : ['', Validators.required],
      email : ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password : ['', Validators.required],
      confirm_password : ['', Validators.required]
    });
    this.getAllCMS()
    this.CMS_slug = this.actRoute.snapshot.paramMap.get('slug');
    this.getCMSDetail(this.CMS_slug);
  }

  getAllCMS() {
    this.cmsService.getFrontCMS().pipe(first()).subscribe({
      next : data => {  
        const cmsData : any = data
        if(cmsData.response) {
          this.CMSData = cmsData.data;
        }
      },
      error : error => {
        console.log(error)
      }
    })
  }

  getCMSDetail(slug) {
    this.CMS_slug = slug;
    this.cmsService.getFrontCmsDetail(slug).pipe(first()).subscribe({
      next : data => {
        const cmsDetail : any = data
        if(cmsDetail.response) {
           this.CMSDetails = cmsDetail.data
        } 
      },
      error : error => {
        console.log(error)
      }
    })
  }

  get f() {
    return this.register_form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if(this.register_form.invalid) {
      return false;
    }

    const register_data = {
      user_name : this.register_form.get('user_name').value,
      email : this.register_form.get('email').value,
      password : this.register_form.get('password').value,
      confirm_password : this.register_form.get('confirm_password').value,
      role : 'user',
      user_status : true
    }

    this.authService.registerNewUser(register_data).pipe(first()).subscribe({
      next : data => {
        const submitData : any = data;
        if(submitData.response) {
          this.message = submitData.message
          // this.userLogin(this.register_form.get('email').value, this.register_form.get('password').value);
          setTimeout(() => {
            this.router.navigate(['/'])
          }, 3000);
        } else {
          this.userNameError = submitData.errors.user_name;
          this.emailError = submitData.errors.email;
          this.passwordError = submitData.errors.password;
        }
      }, 
      error : error => {
        console.log(error);
      }
    })
  }

  userLogin(email, password) {
    const data = {
      email : email,
      password : password
    };
    this.authService.frontAuthentication(data).pipe(first()).subscribe({
      next : data => {
        const userData : any = data;
        if(userData.response) {
          this.setCookie(userData);
          this.message = userData.message;
        } else {
          this.message = userData.message;
        }
      },
      error : error => {
        console.log(error);
      }
    });
  }

  setCookie(userObject) {
    this.cookieService.delete('front_user_data');
    this.cookieService.delete('front_session_token');
    // localStorage.removeItem('front_user_data');
    let expire = new Date();
    var time = Date.now() + ((3600 * 1000) * 1);
    expire.setTime(time);
    const userDetail : any = {
      user_name : userObject.data.user_name,
      user_slug : userObject.data.user_slug
    };
    // localStorage.setItem('front_user_data', JSON.stringify(userDetail));
    this.cookieService.set('front_user_data', btoa(JSON.stringify(userObject.data)), expire);
    this.cookieService.set('custom_theme', btoa(JSON.stringify(userObject.data.custom_theme)), expire);
    this.cookieService.set('front_session_token', btoa(userObject.token), expire);
  }

  pwdMatch() {
    const pwd = this.register_form.get('password').value;
    const cpwd = this.register_form.get('confirm_password').value;

    if(pwd != cpwd) {
      this.passwordError = "Password is not match, Please enter valid password."
      return false;
    } else {
      this.passwordError = "";
      return true;
    }
  }
}


