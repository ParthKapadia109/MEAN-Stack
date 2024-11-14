import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import { ModuleService } from '../../../service/module.service';
@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
  
  roleSlug = "";
  moduleSlug = "";
  modulesData : any = [];
  editModuleData : any = [];

  moduleForm : FormGroup;
  submit = false;

  message = "";
  errors : any;
  currentUserPermission : any = []
  validationError : any = [];
  currentUserSlug =  ""

  title = "Add";

  constructor(
    private actRoute : ActivatedRoute,
    private moduleService : ModuleService,
    private fb : FormBuilder,
    private router : Router,
    private cookieService: CookieService
  ) {
    this.moduleForm = this.fb.group({
      title : ['', Validators.required],
      status : ['', Validators.required],
      subModule : this.fb.array([])
    })
  }

  ngOnInit(): void {
    let module_slug ="";
    const currentUserData = this.cookieService.get('USER_DATA');
    if(currentUserData) {
      let dataArr : any = JSON.parse(atob(currentUserData));
      const permission = dataArr.permission;
      permission.forEach(element => {
        if(element.module_slug == 'module' && element.title == 'Module') {
          module_slug = element.module_slug
          element.sub_module.forEach(ele => {
            this.currentUserPermission.push(ele.sub_module_slug);
          })
        } 
      });
      this.currentUserSlug = dataArr.user_slug;
    }
    if(module_slug == 'module') {
      if(this.currentUserPermission.includes('view-module'))
      {
        this.getAllModule();
      }
    } else {
      this.router.navigate(['/admin/error-403'])
    }
  }

  subModule() : FormArray {
    return this.moduleForm.get('subModule') as FormArray
  }

  newSubModule() : FormGroup {
    return this.fb.group({
      sub_module : ''
    });
  }

  addSubModule() {
    this.subModule().push(this.newSubModule())
  }

  removeSubModule(i : number) {
    this.subModule().removeAt(i);
  }

  get f() {
    return this.moduleForm.controls;
  }

  getAllModule() {
    this.moduleService.getAllModule().pipe(first()).subscribe({
      next : data => {
        const modules : any = data;
        if(modules.response) {
          this.modulesData = modules.data;
        }
      }, 
      error : error => {
        console.log(error);
      }
    })
  }

  resetForm() {
    this.title = "Add";
    // this.moduleForm.controls['title'].reset();
    // this.moduleForm.controls['status'].reset();
    // this.moduleForm.controls['subModule'].reset();
    this.moduleForm.reset();
    this.subModule().clear();
    this.moduleForm.get('title').clearValidators();
    this.moduleForm.get('title').updateValueAndValidity();
    this.moduleForm.get('status').clearValidators();
    this.moduleForm.get('status').updateValueAndValidity();
    this.moduleForm.get('subModule').clearValidators();
    this.moduleForm.get('subModule').updateValueAndValidity();
  }

  editModule(module_slug) {
    this.subModule().clear();
    this.title = "Edit";
    this.moduleSlug = module_slug;
    this.moduleService.editModule(module_slug).pipe(first()).subscribe({
      next : data => {
        const editdata : any = data;
        this.moduleForm.get('title').setValue(editdata.data.title);
        this.moduleForm.get('status').setValue(editdata.data.status);
        
        editdata.data.sub_module.forEach(element => {
          var res=this.initModule(element.sub_module_title);
          this.subModule().push(res)
        });        
      }, 
      error : error => {
        console.log(error);
      }
    })
  }

  initModule(moduleName) {
    return this.fb.group({
      sub_module : moduleName
    });
  }

  onSubmit() {
    this.submit = true;
    
    if(this.moduleForm.invalid) {
      return false;
    }
    
    let sub_module : any = [];
    this.moduleForm.get('subModule').value.map(function(el) {
      if(el.sub_module != '') {
        sub_module.push(el.sub_module);
      }
    })   

    if(sub_module.length === 0) {
      this.errors={'sub_module_title' : 'Enter sub module title!'};
      return false;
    }  

    const module_data = {
      title : this.moduleForm.get('title').value,
      sub_module_title : sub_module,
      status : this.moduleForm.get('status').value
    }    
    
    if(this.moduleSlug != '') {
      this.moduleService.updateModule(this.moduleSlug, module_data).pipe(first()).subscribe({
        next : data => {
          const Data : any = data;
          if(Data.response) {
            this.message = Data.message;
            this.title = "Add";
            this.resetForm()

            setTimeout(() => {
              this.getAllModule();
              this.message = ""
            }, 2000);
          } else {
            Data.errors.map(function(el) {
              this.errors.push(el);
            });
            console.log(this.errors);
          }
        }, 
        error : error => {
          // console.log(error.error.errors);
          this.errors = error.error.errors[0];
          console.log(this.errors);
        }
      })
    } else {
      this.moduleService.addModule(module_data).pipe(first()).subscribe({
        next : data => {
          const Data : any = data;
          if(Data.response) {
            this.message = Data.message;
            this.resetForm()
            setTimeout(() => {
              this.getAllModule();
              this.message = "";
            }, 2000);
          } else {
            const errors : any = Data.errors;
            // errors.map(function(el) {
            //   this.errors.push(el);
            // });
            this.errors = errors;
            console.log(this.errors);
          }
        }, 
        error : error => {
          // console.log(error.error.errors);
          this.errors = error.error.errors[0];
          console.log(this.errors);
        }
      })
    }
  }

  deleteModule(module_slug) {
    const msgDelete = confirm("are you sure you want to delete the module?");
    if(msgDelete) {
      this.moduleService.deleteModule(module_slug).pipe(first()).subscribe({
        next : data => {
          const resData : any = data;
          if(resData.response) {
            this.message = resData.message
            
            const currentUserData = this.cookieService.get('USER_DATA');
            if(currentUserData) {
              let dataArr : any = JSON.parse(atob(currentUserData));
              
              const permission = dataArr.permission;
              const newPermissionArray = Array()
              permission.forEach(element => {
                if(element.module_slug != module_slug) {
                  newPermissionArray.push(element);
                }
              });
              const newArr = {
                "email": dataArr.email,
                "permission": newPermissionArray,
                "role": dataArr.role,
                "user_name": dataArr.user_name,
                "user_slug": dataArr.user_slug 
              }
              this.cookieService.set('USER_DATA', btoa(JSON.stringify(newArr)));
            }
            
            setTimeout(() => {
              this.getAllModule();
              this.message = "";
            }, 2000);
          } else {
            this.message = resData.message
          }
        },
        
        error : error => {
          console.log(error)
        }
      })
    }
  }
}
