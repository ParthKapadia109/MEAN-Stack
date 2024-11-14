import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { RoleService } from '../../../../service/role.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  addForm : FormGroup;
  submitted = false;

  message = ""
  error :any = []

  roleData : any = [];

  emailPattern = "^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  namePattern = "([A-Z][a-z]*)([\\s\\\][A-Z][a-z]*)*";
  confirmPwdError = "";

  constructor(
    private userService : UserService,
    private roleService : RoleService,
    private formBuilder : FormBuilder,
    private route : Router
  ) { }

  ngOnInit(): void {
    
    this.getRoleData();

    this.addForm = this.formBuilder.group({
      user_name : ['', [Validators.required]],
      email : ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password : ['', Validators.required],
      confirm_password : ['', Validators.required],
      role : ['1', Validators.required],
      user_status : ['', Validators.required],
      sidebar_toggle : ['']
    });
  }

  getRoleData() {
    this.roleService.getSelectRole().pipe(first()).subscribe({
      next : data => {
        const responseData : any = data;
        if(responseData.response) {
          const roleArr = responseData.data;
          const newArr = roleArr.filter( el => el.role_status !== false );
          this.roleData = newArr;
        }
      },
      error : error => {
        console.log(error);
      }
    });
  }

  get f() {
    return this.addForm.controls; 
  }

  onSubmit() {
    this.submitted = true;
    
    if(this.addForm.invalid) {
      return false;
    }

    if(this.addForm.get('sidebar_toggle').value == "") {
      this.addForm.get('sidebar_toggle').setValue(false);
    }

    this.userService.addNewUser(this.addForm.value).pipe(first()).subscribe({
      next : data => {
        const addUser : any = data;
        console.log(addUser);
        
        if(addUser.response) {
          this.message = addUser.message;
          setTimeout(() => {
            this.route.navigate(['admin/user'])
          }, 3000);
        }
        else {
          this.error = addUser.errors;
        }
      },
      error : error => {
        console.log(error);
        
      }
    })
  }

  pwdMatch() {
    const pwd = this.addForm.get('password').value;
    const cpwd = this.addForm.get('confirm_password').value;

    if(pwd != cpwd) {
      this.confirmPwdError = "Password is Not match, Please enter valid password!"
      return false;
    } else {
      this.confirmPwdError = "";
      return true;
    }
  }
}
