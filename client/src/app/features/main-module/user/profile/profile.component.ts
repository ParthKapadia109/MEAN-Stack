import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../service/user.service';
import { RoleService } from '../../../../service/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  editForm : FormGroup;
  submitted = false;
  slug = ""
  _id = "";

  message = ""
  error :any = []

  errors = ""

  roleData : any = [];

  confirmPwdError = ""

  constructor(
    private userService : UserService,
    private roleService : RoleService,
    private formBuilder : FormBuilder,
    private route : Router,
    private actRoute : ActivatedRoute,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.getRoleData();

    const user_slug = this.actRoute.snapshot.paramMap.get('slug');

    this.slug = user_slug;

    const currentUserData = this.cookieService.get('USER_DATA');
    if(currentUserData) {
      let dataArr : any = JSON.parse(atob(currentUserData));
      const currentUserSlug = dataArr.user_slug;

      if(currentUserSlug == user_slug) {
        this.getUserDetails(user_slug);
      } else {
        this.route.navigate(['/admin/error-403'])
      }
    }

    this.editForm = this.formBuilder.group({
      user_name : ['', Validators.required],
      email : ['', Validators.required],
      password : [''],
      confirm_password : [''],
      user_slug : ['', Validators.required],
      role : ['', Validators.required],
      user_status : ['', Validators.required],
      sidebar_toggle : ['']
    });
  }

  getRoleData() {
    this.roleService.getAllRole().pipe(first()).subscribe({
      next : data => {
        const responseData : any = data;
        if(responseData.response) {
          this.roleData = responseData.data
        }
      },
      error : error => {
        console.log(error);
      }
    });
  }

  get f() {
    return this.editForm.controls; 
  }

  getUserDetails(slug) {
    this.userService.getUserDetail(slug).pipe(first()).subscribe({
      next : data => {
        const userEditData : any = data;
        if(userEditData.response) {
          this._id = userEditData.data._id;
          this.editForm.controls['user_name'].setValue(userEditData.data.user_name);
          this.editForm.controls['email'].setValue(userEditData.data.email);
          this.editForm.controls['role'].setValue(userEditData.data.role);
          this.editForm.controls['user_slug'].setValue(userEditData.data.user_slug);
          this.editForm.controls['user_status'].setValue(userEditData.data.user_status);
          this.editForm.controls['sidebar_toggle'].setValue(userEditData.data.sidebar_toggle);
        } else {
          this.errors = userEditData.errors
        }
      },
      error : error => {
        console.log(error);
      }
    })
  }

  onSubmit() {
    this.submitted = true;
    if(this.editForm.invalid) {
      return false;
    }
    this.userService.editUser(this._id, this.editForm.value).pipe(first()).subscribe({
      next : data => {
        const updateUser : any = data;

        if(updateUser.response) {
          this.message = "Successfully updated your profile.";

          const currentUserData = this.cookieService.get('USER_DATA');
          if(currentUserData) {
            let dataArr : any = JSON.parse(atob(currentUserData));
            if(dataArr.sidebar_toggle != this.editForm.get('sidebar_toggle').value){
              dataArr.sidebar_toggle = this.editForm.get('sidebar_toggle').value;
            }
            this.cookieService.set('USER_DATA', btoa(JSON.stringify(dataArr)));
          }

          setTimeout(() => {
            this.route.navigate(['admin/dashboard'])
          }, 3000);
        } else {
          this.error = updateUser.errors;
          console.log(this.error);
          
        }
      },
      error : error => {
        console.log(error);
        
      }
    })
  }

  pwdMatch() {
    const pwd = this.editForm.get('password').value;
    const cpwd = this.editForm.get('confirm_password').value;

    if(pwd != cpwd) {
      this.confirmPwdError = "Password is Not match, Please enter valid password!"
      return false;
    } else {
      this.confirmPwdError = "";
      return true;
    }
  }

}
