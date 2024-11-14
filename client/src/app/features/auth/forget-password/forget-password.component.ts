import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  forgotPasswordForm : FormGroup
  submitted = false; 
  message = "";
  error = "";
  btnDisable = false;

  constructor(
    private fb : FormBuilder,
    private  authService : AuthService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email : ['', Validators.required]
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.btnDisable = true;

    if(this.forgotPasswordForm.invalid) {
      return false;
    }

    this.authService.forgotPassword(this.forgotPasswordForm.value).pipe(first()).subscribe({
      next : data => {
        const forgotPasswordData : any = data;
        if(forgotPasswordData.response) {
          this.message = forgotPasswordData.message
          this.btnDisable = true;
        } else {
          this.error = forgotPasswordData.error
        }
      },
      error : error => {
        console.log(error)
      }
    })
  }

}
