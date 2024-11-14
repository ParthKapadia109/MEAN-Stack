import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  token = "";
  email = "";

  recoverPasswordForm : FormGroup
  submitted = false;
  message = "";
  error = "";

  constructor(
    private actroute : ActivatedRoute,
    private fb : FormBuilder,
    private authService : AuthService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.token = this.actroute.snapshot.paramMap.get('token');
    this.email = this.actroute.snapshot.paramMap.get('email');
  
    this.recoverPasswordForm = this.fb.group({
      email : ['', Validators.required],
      password : ['', Validators.required],
      confirm_password : ['', Validators.required]
    });

    this.recoverPasswordForm.controls['email'].setValue(this.email);
  
  }

  get f() {
    return this.recoverPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if(this.recoverPasswordForm.invalid) {
      return false;
    } 

    const pwd = {
      email : this.recoverPasswordForm.get('email').value,
      password : this.recoverPasswordForm.get('password').value,
      confirm_password : this.recoverPasswordForm.get('confirm_password').value,
      token : this.token
    }

    this.authService.recoverPassword(pwd).pipe(first()).subscribe({
      next : data => {
        const resData : any = data;
        if(resData.response) {
          this.message = resData.message

          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 3000);
        } else {
          this.error = resData.error
        }
      },
      error : error => {
        this.error = error.error.error
      }
    })
  }
}
