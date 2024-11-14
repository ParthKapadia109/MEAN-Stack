import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CmsService } from 'src/app/service/cms.service';

@Component({
  selector: 'app-edit-cms',
  templateUrl: './edit-cms.component.html',
  styleUrls: ['./edit-cms.component.css']
})
export class EditCmsComponent implements OnInit {

  cmsForm : FormGroup
  submit = false 

  message = ""
  error = ""

  slug = ""
  _id = ""

  constructor(
    private fb : FormBuilder,
    private cmsService : CmsService,
    private router : Router,
    private actRoute : ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.slug = this.actRoute.snapshot.paramMap.get('slug');
    this._id = this.actRoute.snapshot.paramMap.get('_id');

    this.getCMSData(this.slug, this._id);

    this.cmsForm = this.fb.group({
      title : ['', Validators.required],
      hading : ['', Validators.required],
      description : ['', Validators.required],
      header : [''],
      footer : [''],
      status : [''],
      slug : ['', Validators.required]
    })

    this.cmsForm.controls['status'].setValue(true);
    this.cmsForm.controls['header'].setValue(false);
    this.cmsForm.controls['footer'].setValue(false);
  }

  getCMSData(slug, _id) {
    this.cmsService.getEditCmsDetails(slug, _id).pipe(first()).subscribe({
      next : data => {
        const editCMS : any = data
        if(editCMS.response) {
          console.log(editCMS)
          this.cmsForm.controls['status'].setValue(editCMS.data.status);
          this.cmsForm.controls['header'].setValue(editCMS.data.header);
          this.cmsForm.controls['footer'].setValue(editCMS.data.footer);
          this.cmsForm.controls['title'].setValue(editCMS.data.title);
          this.cmsForm.controls['hading'].setValue(editCMS.data.hading);
          this.cmsForm.controls['description'].setValue(editCMS.data.description);
          this.cmsForm.controls['slug'].setValue(this.slug);
        } else {
          this.error = editCMS.error
        }
      },
      error : error => {
        console.log(error)
      }
    })
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
    this.cmsService.UpdateCmsDetails(this._id, this.cmsForm.value).pipe(first()).subscribe({
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
