import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {MailTemplateService} from 'src/app/service/mail-template.service'
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-edit-mail-template',
  templateUrl: './edit-mail-template.component.html',
  styleUrls: ['./edit-mail-template.component.css']
})
export class EditMailTemplateComponent implements OnInit {

  // Form 
  message = ""
  error = ""
  submit = false
  editMail : FormGroup

  // Edit Data
  mailSlug = ""
  id = ""

  nameFind = false;
  emailFind = false;
  subjectFind = false;
  resetLink = false;

  defaultKey = [
    {
      active: false, name : 'Subject', value : 'subject'
    },
    {
      active: false, name : 'User Name', value : 'user_name'
    },
    {
      active: false, name : 'Email', value : 'email'
    },
    {
      active: false, name : 'Reset Password Link', value : 'reset_password_link'
    }
  ]

  constructor(
    private fb : FormBuilder,
    private mailTemplateService : MailTemplateService,
    private router : Router,
    private actRoute : ActivatedRoute,
    private clipboardService: ClipboardService
  ) {
    this.mailSlug = this.actRoute.snapshot.paramMap.get('slug');
    this.id = this.actRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.editMail = this.fb.group({
      template_name : ['', Validators.required],
      subject : ['', Validators.required],
      description : ['', Validators.required],
      status : [true],
      slug : ['', Validators.required]
    });

    this.getEditData(this.mailSlug, this.id);

  }

  getEditData(slug, id){
    this.mailTemplateService.findMailDetail(slug, id).pipe(first()).subscribe({
      next : data => {
        const mailDetail : any = data;
        if(mailDetail.response){
          console.log(mailDetail.data)
          this.editMail.controls['template_name'].setValue(mailDetail.data.template_name);
          this.editMail.controls['subject'].setValue(mailDetail.data.subject);
          this.editMail.controls['description'].setValue(mailDetail.data.description);
          this.editMail.controls['status'].setValue(mailDetail.data.status);
          this.editMail.controls['slug'].setValue(mailDetail.data.slug);
          this.setValueInKey(mailDetail.data.description)
        } else {
          this.error = mailDetail.message;
          setTimeout(() => {
            this.error = ""
          }, 5000);
        }
      }, error : error => {
        console.log(error);
      }
    })
  }

  get f() {
    return this.editMail.controls;
  }

  onSubmit() {
    this.submit = true;
    if(this.editMail.invalid) {
      return false;
    }
    console.log(this.editMail.value)
    this.mailTemplateService.updateMailDetail(this.id, this.editMail.value).pipe(first()).subscribe({
      next : data => {
        const mail : any = data;
        if(mail.response) {
          this.message = mail.message
          setTimeout(() => {
            this.router.navigate(['/admin/mail-template'])
          }, 2000);
        } else {
          this.error = mail.message
          setTimeout(() => {
            this.error = "";
          }, 5000);
        }
      },
      error : error => {
        console.log(error)
      }
    })
  }

  addName() {
    var findStr = "USER_NAME";
    var defaultTemplate = this.editMail.get('description').value;
    if(defaultTemplate.includes(findStr)) {
      var replaceStr = defaultTemplate.replace(findStr, 'user_name');
      defaultTemplate = replaceStr;
      this.editMail.controls['description'].setValue(replaceStr);
      this.nameFind = true;
    } else {
      var replaceStr = defaultTemplate.replace('user_name', findStr);
      defaultTemplate = replaceStr;
      this.editMail.controls['description'].setValue(replaceStr);
      this.nameFind = false;
    }
  }

  addEmailAddress() {
    var findStr = "EMAIL";
    var defaultTemplate = this.editMail.get('description').value;
    if(defaultTemplate.includes(findStr)) {
      var replaceStr = defaultTemplate.replace(findStr, 'email');
      defaultTemplate = replaceStr;
      this.editMail.controls['description'].setValue(replaceStr);
      this.emailFind = true;
    } else {
      var replaceStr = defaultTemplate.replace('email', findStr);
      defaultTemplate = replaceStr;
      this.editMail.controls['description'].setValue(replaceStr);
      this.emailFind = false;
    }
  }

  addSubject() {
    var findStr = "SUBJECT";
    var defaultTemplate = this.editMail.get('description').value;
    if(defaultTemplate.includes(findStr)) {
      var replaceStr = defaultTemplate.replace(findStr, 'subject');
      defaultTemplate = replaceStr;
      this.editMail.controls['description'].setValue(replaceStr);
      this.subjectFind = true;
    } else {
      var replaceStr = defaultTemplate.replace('subject', findStr);
      defaultTemplate = replaceStr;
      this.editMail.controls['description'].setValue(replaceStr);
      this.subjectFind = false;
    }
  }

  addResetLink() {
    var findStr = "RESETLINK";
    var defaultTemplate = this.editMail.get('description').value;
    if(defaultTemplate.includes(findStr)) {
      var replaceStr = defaultTemplate.replace(findStr, 'link');
      defaultTemplate = replaceStr;
      this.editMail.controls['description'].setValue(replaceStr);
      this.resetLink = true;
    } else {
      var replaceStr = defaultTemplate.replace('link', findStr);
      defaultTemplate = replaceStr;
      this.editMail.controls['description'].setValue(replaceStr);
      this.resetLink = false;
    }
  }
  
  setValueInKey(content) {
    if(content.includes('user_name')) {
      this.nameFind = true
    } 
    if (content.includes('email')) {
      this.emailFind = true
    } 
    if (content.includes('subject')) {
      this.subjectFind = true
    } 
    if (content.includes('link')) {
      this.resetLink = true;
    }
  }

  copyContent(text) {
    this.defaultKey.forEach(element => {
      if(element.value === text) {
        element.active = true;
        this.clipboardService.copyFromContent('{{'+element.value+'}}');
      } else {
        element.active = false;
      }
    })

  }
}
