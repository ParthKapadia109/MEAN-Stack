import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ModuleService } from 'src/app/service/module.service';

@Component({
  selector: 'app-module-permission',
  templateUrl: './module-permission.component.html',
  styleUrls: ['./module-permission.component.css']
})
export class ModulePermissionComponent implements OnInit {

  roleSlug = '';
  rolePermission : any = [];
  modulesData : any = [];
  subModuleArraySlug : any = [];

  moduleForm : FormGroup;
  message : "";
  constructor(
    private actRoute : ActivatedRoute,
    private moduleService : ModuleService,
    private fb : FormBuilder
  ) {
    this.moduleForm = this.fb.group({
      sub_module : this.fb.array([]),
    });

    this.roleSlug = this.actRoute.snapshot.paramMap.get('slug');
    this.getRolePermission(this.roleSlug);
  }

  ngOnInit(): void {
    this.getAllModule();
  }

  onCheckedchange(e) {
    const sub_module: FormArray = this.moduleForm.get('sub_module') as FormArray;

    if (e.target.checked) {
      // sub_module.push(new FormControl(e.target.value));
      this.checkDuplicatedValue(e.target.value);
      this.subModuleArraySlug.push(e.target.value);
    } else {
      // let i: number = 0;
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

  get f() {
    return this.moduleForm.controls;
  }

  getRolePermission(slug) {
    this.moduleService.rolePermission(slug).pipe(first()).subscribe({
      next : data => {
        const perData : any = data;
        if(perData.response) {
          this.rolePermission = perData.data.sub_module;
          const sub_module : FormArray = this.moduleForm.get('sub_module') as FormArray
          this.rolePermission.forEach(element => {
            // sub_module.push(new FormControl(element));
            this.checkDuplicatedValue(element)
            this.subModuleArraySlug.push(element)
          });
        }
      }, 
      error : error => {
        console.log(error);
        
      }
    })
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

  checkValue(moduleSlug) {
    let check = false; 
    // this.rolePermission.forEach(element => {
    //   if(element == moduleSlug) {
    //     check = true;
    //   }
    // });
    this.subModuleArraySlug.forEach(element => {
      if(element == moduleSlug) {
        check = true;
      }
    });
    return check;
  }

  onSubmit() {

    const moduleData = {
      role_slug : this.roleSlug,
      sub_module : this.moduleForm.get('sub_module').value,
      status : false
    }

    console.log(moduleData)
    
    this.moduleService.addPermission(moduleData).pipe(first()).subscribe({
      next : data => {
        const permissionRes : any = data;
        if(permissionRes.response) {
          this.message = permissionRes.message;
          setTimeout(() => {
            this.message = ""
          }, 2000);
        } else {
          console.log(permissionRes);
        }
      },
      error : error => {
        console.log(error);
      }
    })
  }

  selectMainModule(e) {
    const sub_module : FormArray = this.moduleForm.get('sub_module') as FormArray
    let subModuleArr : any = [];
    this.modulesData.forEach(element => {
      if(element.module_slug === e.target.value) {
        subModuleArr = element.sub_module
      }
    })

    if(e.target.checked) {
      subModuleArr.forEach(ele => {
        this.checkDuplicatedValue(ele.sub_module_slug);
        this.subModuleArraySlug.push(ele.sub_module_slug);
        this.checkValue(ele.sub_module_slug);
      }); 
      subModuleArr = [];
    } else {
      subModuleArr.forEach(ele => {
        // this.removeSubModulePermission(ele.sub_module_slug);
        // this.removeRolePermission(ele.sub_module_slug);
        // let i = 0;
        // sub_module.controls.forEach((item: FormControl) => {
        //   if (item.value == ele.sub_module_slug) {
        //     sub_module.removeAt(i);
        //     return;
        //   }
        //   i++;
        // });
        // this.checkValue(ele.sub_module_slug)
        this.uncheckValue(ele.sub_module_slug);
      });
      subModuleArr = [];
    }
  }

  removeRolePermission(slug) {
    if(this.rolePermission.length > 0) {
      if(this.rolePermission.includes(slug)){
        this.rolePermission.forEach((role, index) => {
          if(role == slug) {
            this.rolePermission.splice(index,1)
          } 
        })
      }
    }
  }

  removeSubModulePermission(slug) {
    if(this.subModuleArraySlug.length > 0 && this.subModuleArraySlug.includes(slug)) {
      this.subModuleArraySlug.forEach((subSlug, index) => {
        if(subSlug == slug) {
          this.subModuleArraySlug.splice(index, 1);
        }
      })
      this.subModuleArraySlug.filter((ele, index) => {
        ele === slug ? this.subModuleArraySlug.splice(index, 1) : ''
      })
    }
  }

  checkDuplicatedValue(slug) {
    const sub_module : FormArray = this.moduleForm.get('sub_module') as FormArray;
    if(sub_module.controls.length > 0) {
      const arraySlug : any = [];
      sub_module.controls.forEach((item: FormControl)=> {
        arraySlug.push(item.value);
      })
      if(arraySlug.includes(slug)) {
        return;
      } else {
        sub_module.push(new FormControl(slug));
      }
    } else {
      sub_module.push(new FormControl(slug));
    }
  }

  mainModuleCheck(slug) {
    const subModule :any = []
    let subModuleLength = 0;
    let avaliableValueCount = 0;
    const selectedModule : any = [];
    let checked = false;

    this.modulesData.forEach(module => {
      if(module.module_slug == slug) {
        module.sub_module.forEach(sub => {
          subModule.push(sub.sub_module_slug)
          const check = this.checkSubModuleValue(sub.sub_module_slug)
          if(check) {
            avaliableValueCount++;
            selectedModule.push(sub.sub_module_slug);
          }
          subModuleLength++;
        });
      }
    })

    if(subModuleLength === avaliableValueCount && subModule.length === selectedModule.length) {
      checked = true;
    } else {
      checked = false;
    }

    return checked;
  }
  
  checkSubModuleValue(slug) {
    const sub_module : FormArray = this.moduleForm.get('sub_module') as FormArray;
    if(sub_module.controls.length > 0) {
      const arraySlug : any = [];
      sub_module.controls.forEach((item: FormControl)=> {
        arraySlug.push(item.value);
      })
      if(arraySlug.includes(slug)) {
        return true;
      }
    }
  }

  uncheckValue(slug) {
    const sub_module: FormArray = this.moduleForm.get('sub_module') as FormArray
    this.removeSubModulePermission(slug);
    this.removeRolePermission(slug);
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
}

