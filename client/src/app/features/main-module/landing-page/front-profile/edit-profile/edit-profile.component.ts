import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  _id = ""
  name = ""
  email = ""
  userSlug = ""

  editForm : FormGroup
  submitted = false;
  error :any = []

  errors = ""
  message = ""

  constructor(
    private cookieService : CookieService,
    private fb : FormBuilder,
    private userService :  UserService,
    private route : Router
  ) { }

  ngOnInit(): void {

    this.editForm = this.fb.group({
      user_name : ['', Validators.required],
      email : ['', Validators.required],
      user_slug : ['', Validators.required],
      confirm_password : [''],
      password : ['']
    })

    const userData = this.cookieService.get('front_user_data');
    if(userData) {
      const data : any = JSON.parse(atob(userData));
      this._id = data._id;
      this.editForm.controls['user_name'].setValue(data.user_name);
      this.editForm.controls['email'].setValue(data.email);
      this.editForm.controls['user_slug'].setValue(data.user_slug);
    }
  }

  get f () {
    return this.editForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if(this.editForm.invalid) {
      return false;
    }

    const editData = {
      user_name : this.editForm.get('user_name').value,
      user_slug : this.editForm.get('user_slug').value,
      email : this.editForm.get('email').value,
      role : 'user',
      user_status : true,
      password : this.editForm.get('password').value,
      confirm_password : this.editForm.get('confirm_password').value,
    }

    this.userService.frontProfileEdit(this._id, editData).pipe(first()).subscribe({
      next : data => {
        const updateUser : any = data;

        if(updateUser.response) {
          this.message = updateUser.message;

          let setCookie = {
            custom_theme: [],
            email: editData.email,
            permission: [],
            role: "User",
            sidebar_toggle: false,
            user_name: editData.user_name,
            user_slug: editData.user_slug,
            _id: this._id,
          };
          const set = JSON.stringify((setCookie));
          this.cookieService.set('front_user_data', btoa(set));

          setTimeout(() => {
            this.route.navigate(['/userProfile'])
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
}
