import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import { ModuleService } from 'src/app/service/module.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {

  roleSlug = '';
  rolePermission: any = [];
  modulesData: any = [];
  userSlug = "";
  userPermission: any = [];
  moduleForm: FormGroup;
  message: "";

  subModuleArraySlug: any = [];

  constructor(
    private actRoute: ActivatedRoute,
    private moduleService: ModuleService,
    private fb: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ) {
    this.moduleForm = this.fb.group({
      sub_module: this.fb.array([]),
    });

    this.roleSlug = this.actRoute.snapshot.paramMap.get('role_slug');
    this.getRolePermission(this.roleSlug);

    this.userSlug = this.actRoute.snapshot.paramMap.get('user_slug');
    this.getUserPermission(this.userSlug);
  }

  ngOnInit(): void {
    this.getAllModule();
  }

  get f() {
    return this.moduleForm.controls;
  }

  getRolePermission(slug) {
    this.moduleService.rolePermission(slug).pipe(first()).subscribe({
      next: data => {
        const perData: any = data;
        if (perData.response) {
          this.rolePermission = perData.data.sub_module;
          // const sub_module : FormArray = this.moduleForm.get('sub_module') as FormArray
          this.rolePermission.forEach(element => {
            // sub_module.push(new FormControl(element));
            this.checkDuplicatedValue(element)
            this.subModuleArraySlug.push(element);
          });
        }
      },
      error: error => {
        console.log(error);

      }
    })
  }

  getUserPermission(slug) {
    this.userService.getUserDetail(slug).pipe(first()).subscribe({
      next: data => {
        const permissionData: any = data;
        if (permissionData.response) {
          this.userPermission = permissionData.data.user_permission;
          // const sub_module : FormArray = this.moduleForm.get('sub_module') as FormArray
          this.userPermission.forEach(element => {
            // sub_module.push(new FormControl(element));
            this.checkDuplicatedValue(element);
            this.subModuleArraySlug.push(element);

          });
        } else {
          console.log(permissionData);
        }
      },
      error: error => {
        console.log(error);
      }
    })
  }

  getAllModule() {
    this.moduleService.getAllModule().pipe(first()).subscribe({
      next: data => {
        const modules: any = data;
        if (modules.response) {
          this.modulesData = modules.data;
        }
      },
      error: error => {
        console.log(error);
      }
    })
  }

  onSubmit() {
    const moduleData = {
      user_slug: this.userSlug,
      user_permission: this.moduleForm.get('sub_module').value,
    }

    this.userService.addPermission(moduleData).pipe(first()).subscribe({
      next: data => {
        const permissionRes: any = data;
        if (permissionRes.response) {
          this.message = permissionRes.message;
          this.getUserPermission(this.userSlug);
          this.getRolePermission(this.roleSlug);
          setTimeout(() => {
            this.message = ""
          }, 2000);
        } else {
          console.log(permissionRes);
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  checkValue(moduleSlug) {
    let check = false;
    // this.rolePermission.forEach(element => {
    //   if (element == moduleSlug) {
    //     check = true;
    //   }
    // });

    // this.userPermission.forEach(element => {
    //   if (element == moduleSlug) {
    //     check = true;
    //   }
    // });

    this.subModuleArraySlug.forEach(element => {
      if (element == moduleSlug) {
        check = true;
      }
    });

    return check;
  }

  onCheckedchange(e) {
    const sub_module: FormArray = this.moduleForm.get('sub_module') as FormArray;
    if (e.target.checked) {
      // sub_module.push(new FormControl(e.target.value));
      this.checkDuplicatedValue(e.target.value);
      this.subModuleArraySlug.push(e.target.value);
    } else {
      let i: number = 0;

      // sub_module.controls.forEach((item: FormControl) => {
      //   if (item.value == e.target.value) {
      //     sub_module.removeAt(i);
      //     return;
      //   }
      //   i++;
      // });

      this.uncheckValue(e.target.value);
    }
  }

  selectMainModule(e) {
    // const sub_module : FormArray = this.moduleForm.get('sub_module') as FormArray
    let subModuleArr: any = [];
    this.modulesData.forEach(element => {
      if (element.module_slug === e.target.value) {
        subModuleArr = element.sub_module
      }
    })

    if (e.target.checked) {
      subModuleArr.forEach(ele => {
        this.checkDuplicatedValue(ele.sub_module_slug);
        this.subModuleArraySlug.push(ele.sub_module_slug);
        this.checkValue(ele.sub_module_slug);
      });
      subModuleArr = [];
    } else {
      subModuleArr.forEach(ele => {
        console.log("Sub Element : ", ele.sub_module_slug);
        // this.removeSubModulePermission(ele.sub_module_slug);
        // this.removeRolePermission(ele.sub_module_slug);
        // this.removeUserPermission(ele.sub_module_slug);
        // let i = 0;

        // sub_module.controls.forEach((item: FormControl) => {
        //   if (item.value == ele.sub_module_slug) {
        //     sub_module.removeAt(i);
        //     return;
        //   }
        //   i++;
        // });
        // this.checkValue(ele.sub_module_slug)
        this.uncheckValue(ele.sub_module_slug)
      });
      subModuleArr = [];
    }
  }

  checkDuplicatedValue(slug) {
    const sub_module: FormArray = this.moduleForm.get('sub_module') as FormArray;
    const arraySlug: any = [];
    if (sub_module.controls.length > 0) {
      sub_module.controls.forEach((item: FormControl) => {
        arraySlug.push(item.value);
      })
      if (!arraySlug.includes(slug)) {
        sub_module.push(new FormControl(slug));
      }
    } else {
      sub_module.push(new FormControl(slug));
    }
    // const length = sub_module.controls.length
    // if (length > 0) {
    //   const newSubModuleArray = []
    //   sub_module.controls.forEach(element => {
    //     if (element != slug) {
    //       console.log(element,"!=",slug)
    //       sub_module.push(new FormControl(slug));
    //     } else {
    //       console.log(element, "=", slug)
    //     }
    //   })
    // }
  }

  mainModuleCheck(slug) {
    const subModule: any = []
    let subModuleLength = 0;
    let avaliableValueCount = 0;
    const selectedModule: any = [];
    let checked = false;

    this.modulesData.forEach(module => {
      if (module.module_slug == slug) {
        module.sub_module.forEach(sub => {
          subModule.push(sub.sub_module_slug)
          const check = this.checkSubModuleValue(sub.sub_module_slug)
          if (check) {
            avaliableValueCount++;
            selectedModule.push(sub.sub_module_slug);
          }
          subModuleLength++;
        });
      }
    })

    if (subModuleLength === avaliableValueCount && subModule.length === selectedModule.length) {
      checked = true;
    } else {
      checked = false;
    }

    return checked;
  }

  checkSubModuleValue(slug) {
    const sub_module: FormArray = this.moduleForm.get('sub_module') as FormArray;
    if (sub_module.controls.length > 0) {
      const arraySlug: any = [];
      sub_module.controls.forEach((item: FormControl) => {
        arraySlug.push(item.value);
      })
      if (arraySlug.includes(slug)) {
        return true;
      }
    }
  }

  uncheckValue(slug) {
    const sub_module: FormArray = this.moduleForm.get('sub_module') as FormArray
    this.removeSubModulePermission(slug);
    this.removeRolePermission(slug);
    this.removeUserPermission(slug);
    let i = 0;
    sub_module.controls.forEach((item: FormControl) => {
      if (item.value == slug) {
        sub_module.removeAt(i);
        return;
      }
      i++;
    });
    this.checkValue(slug)
  }

  removeRolePermission(slug) {
    if (this.rolePermission.length > 0 && this.rolePermission.includes(slug)) {
      this.rolePermission.forEach((roleSlug, index) => {
        if (roleSlug == slug) {
          this.rolePermission.splice(index, 1)
        }
      })
    }
  }

  removeUserPermission(slug) {
    if (this.userPermission.length > 0 && this.userPermission.includes(slug)) {
      this.userPermission.forEach((userSlug, index) => {
        if (userSlug == slug) {
          this.userPermission.splice(index, 1)
        }
      })
    }
  }

  removeSubModulePermission(slug) {
    if (this.subModuleArraySlug.length > 0 && this.subModuleArraySlug.includes(slug)) {
      this.subModuleArraySlug.forEach((subSlug, index) => {
        if (subSlug === slug) {
          this.subModuleArraySlug.splice(index, 1);
        }
      })
      this.subModuleArraySlug.filter((ele, index) => {
        ele === slug ? this.subModuleArraySlug.splice(index, 1) : ''
      })
    }
  }
}
