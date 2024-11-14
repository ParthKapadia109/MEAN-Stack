import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CmsService } from '../../../../service/cms.service';

@Component({
  selector: 'app-add-cms',
  templateUrl: './add-cms.component.html',
  styleUrls: ['./add-cms.component.css']
})
export class AddCmsComponent implements OnInit {

  cmsForm : FormGroup
  submit = false 

  message = ""
  error = ""

  constructor(
    private fb : FormBuilder,
    private cmsService : CmsService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.cmsForm = this.fb.group({
      title : ['', Validators.required],
      hading : ['', Validators.required],
      description : ['', Validators.required],
      header : [''],
      footer : [''],
      status : [''],
    })

    this.cmsForm.controls['status'].setValue(true);
    this.cmsForm.controls['header'].setValue(false);
    this.cmsForm.controls['footer'].setValue(false);
  }

  get f () {
    return this.cmsForm.controls;
  }

  onSubmit() {
    this.submit = true
    if(this.cmsForm.invalid) {
      return false;
    }
    
    console.log(this.cmsForm.value);
    this.cmsService.addCMS(this.cmsForm.value).pipe(first()).subscribe({
      next : data => {
        const cmsRes : any = data
        if(cmsRes.response) {
          this.message = cmsRes.message
          setTimeout(() => {
            this.router.navigate(['admin/cms'])
          }, 3000);
        } else {
          this.error = cmsRes.error;
        }
      },
      error : error => {
        console.log(error);
      }
    })
  }


}
