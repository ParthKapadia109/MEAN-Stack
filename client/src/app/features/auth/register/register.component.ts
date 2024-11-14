import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  register_form : FormGroup;
  message = "";
  submitted = false;
  userNameError = "";
  emailError = "";
  passwordError = "";
  
  constructor(
    private fb : FormBuilder,
    private authService : AuthService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.register_form = this.fb.group({
      user_name : ['', Validators.required],
      email : ['', Validators.required],
      password : ['', Validators.required],
      confirm_password : ['', Validators.required]
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

}
