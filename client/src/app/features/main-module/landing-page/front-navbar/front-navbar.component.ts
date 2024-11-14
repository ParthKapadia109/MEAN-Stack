import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CmsService } from 'src/app/service/cms.service';
import { AuthService } from '../../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FrontNavBarService } from '../../../../service/front-nav-bar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-front-navbar',
  templateUrl: './front-navbar.component.html',
  styleUrls: ['./front-navbar.component.css']
})
export class FrontNavbarComponent implements OnInit {

  CMSData : any = []
  activeURL = "";
  subscription : Subscription

  loginForm : FormGroup;
  submitted = false;

  message = "";
  class = "";
  errors : any = [];

  logging = false;
  userName = "";

  constructor(
    private cmsService : CmsService,
    private fb : FormBuilder,
    private authService : AuthService,
    private actRoute : ActivatedRoute,
    private cookieService: CookieService,
    private frontNavBarService : FrontNavBarService
  ) { 
    this.subscription = this.frontNavBarService.onChangeNavBar().subscribe(slugName => {
      const slug = slugName
      this.activeURL = slug;
    })
  }

  ngOnInit(): void {
    this.getAllCMS();
    this.userLogging();
    this.loginForm = this.fb.group({
      email : ['', Validators.required],
      password : ['', Validators.required]
    });
    if(this.actRoute.component['name'] == 'LandingPageComponent' ) 
    {
      this.activeURL = '/';
    } else if(this.actRoute.component['name'] == 'FrontProfileComponent') {
      this.activeURL = 'profile';
    } else if(this.actRoute.component['name'] == 'FrontRegisterComponent') {
      this.activeURL = 'register';
    } else {
      this.activeURL = this.actRoute.snapshot.paramMap.get('slug');
    }
  }

  userLogging(){
    const userData = this.cookieService.get('front_user_data');
    const userToken= this.cookieService.get('front_session_token');
    if(userToken && userData) {
      this.logging = true;
      const data = JSON.parse(atob(userData));
      this.userName = data.user_name;
    }
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

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    
    if(this.loginForm.invalid) { return false; }
    
    this.authService.frontAuthentication(this.loginForm.value).pipe(first()).subscribe({
      next : data => {
        const userData : any = data;
        if(userData.response) {
          this.setCookie(userData);
          this.message = userData.message;
          this.class = "alert-success";
          alert(userData.message);
          this.userLogging();
        } else {
          alert(userData.message);
          // this.message = userData.message;
          // this.class = "alert-danger";
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

  userLogout() {
    const signOut = confirm("Are you sure you want to sign out?");
    if(signOut == true) {
      this.cookieService.delete('front_user_data');
      this.cookieService.delete('front_session_token');
      this.cookieService.delete('custom_theme');
      this.ngOnInit();
      this.userLogging();
      location.reload();

    }
  }

  getCMSDetail(slug) {
    this.activeURL = slug;
    this.frontNavBarService.navBarChanging(slug);
  }

}
