import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { RoleService } from '../../../service/role.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';

declare var $ : any

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  title = "Add";
  display = "";

  slug = "";

  submitted = false;

  roleForm : FormGroup;

  roleData : any = [];
  temp : any = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  
  responseData : any = [];

  message = "";
  errors = "";

  currentUserPermission : any = [];
  currentUserSlug = "";

  constructor(
    private roleService : RoleService,
    private formBuilder : FormBuilder,
    private router : Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    let role_slug = ""
    const currentUserData = this.cookieService.get('USER_DATA');
    if(currentUserData) {
      let dataArr : any = JSON.parse(atob(currentUserData));
      const permission = dataArr.permission;
      permission.forEach(element => {
        if(element.module_slug == 'role' && element.title == 'Role') {
          role_slug = element.module_slug;
          element.sub_module.forEach(ele => {
            this.currentUserPermission.push(ele.sub_module_slug);
          })
        } 
      });
      this.currentUserSlug = dataArr.user_slug;
    }
    if(role_slug == 'role') {
      if(this.currentUserPermission.includes('view-role')) {
        this.getRoleData();
      }   
    } else {
      this.router.navigate(['/admin/error-403'])
    }
    
    this.roleForm = this.formBuilder.group({
      role_name : ['', Validators.required],
      role_status : ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $('.ngx-datatable.bootstrap .datatable-footer').css('background','#007bff');
  }

  get f() {  return this.roleForm.controls;  }

  getRoleData() {
    this.roleService.getAllRole().pipe(first()).subscribe({
      next : data => {
        this.responseData = data;
        if(this.responseData.response) {
          this.roleData = this.responseData.data
          this.temp = this.responseData.data
        }
      },
      error : error => {
        console.log(error);
      }
    })
  }

  editRole(slug) {
    this.title = "Edit";
    this.display = "";
    this.slug = slug;

    this.roleService.getRoleDataBySlug(slug).pipe(first()).subscribe({
      next : data => {
        const role : any = data;
        this.roleForm.controls['role_name'].setValue(role.data.role_name);
        this.roleForm.controls['role_status'].setValue(role.data.role_status);
      }, 
      error : error => {
        console.log(error);
      }
    })
  }

  resetForm() {
    this.submitted = false;
    this.title = "Add";
    this.display = "";
    this.slug = "";
    this.roleForm.controls['role_name'].reset();
    this.roleForm.controls['role_status'].reset();
    // this.roleForm.reset(this.roleForm.value);
  }

  onSubmit()  {
    this.submitted = true;
    if(this.roleForm.invalid) {
      return false;
    }

    // This If condition  check the ROle is Edit Otherwise The Role Is added.
    if(this.slug != '') {
      this.roleService.updateRoleBySlug(this.slug, this.roleForm.value).pipe(first()).subscribe({
        next : data => {
          
          const roleEdit : any = data;
          if(roleEdit.response) {
            this.message = roleEdit.message;
            setTimeout(() => {
              this.getRoleData();
              this.message = "";
              this.resetForm();
            }, 3000);
          } else {
            this.errors = roleEdit.errors;
          }
        }, 
        error : error => {
          console.log(error);
        }
      })
    } else {
      this.roleService.addNewRole(this.roleForm.value).pipe(first()).subscribe({
        next : data => {
          
          const roleAdd : any = data;
          if(roleAdd.response) {
            this.message = roleAdd.message;
            setTimeout(() => {
              this.getRoleData();
              this.message = "";
              this.resetForm();
            }, 3000);
          } else {
            console.log(roleAdd.errors);
            this.errors = roleAdd.errors;
          }
        }, 
        error : error => {
          console.log(error);
        }
      })
    }
    
  }

  deleteRoleData (slug) {
    const con = confirm('Are you sure you want to delete role ?');
    if(con) {
      this.roleService.deleteRoleBySlug(slug).pipe(first()).subscribe({
        next : data => {
          
          const roleDelete : any = data;
          if(roleDelete.response) {
            this.message = roleDelete.message;
              setTimeout(() => {
                this.getRoleData();
                this.message = "";
              }, 3000);
            } else {
              this.errors = roleDelete.errors;
              setTimeout(() => {
                this.errors = "";
              }, 3000);
            }
        }, 
        error : error => {
          console.log(error);
        }
      })    
    }
  }

  checkedSwitch(status) {
    if (status) {
      return true;
    } else {
      return false;
    }
  }

  onChangeStatus(_id, slug, status) {
    
    const data = {
      _id : _id,
      status : status ? false : true,
      slug : slug
    }

    console.log(data);

    this.roleService.changeStatus(data).pipe(first()).subscribe({
      next : data => {
        const roleStatusChange : any = data
        if(roleStatusChange.response) {
          this.message = roleStatusChange.message
          setTimeout(() => {
            this.getRoleData();
            this.message = ""
          }, 2200);
        } else {
          console.log(roleStatusChange)
        }
      },
      error : error => {
        console.log(error);
      }
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.role_name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.roleData = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
