import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular';
import { first } from 'rxjs/operators';
import {MailTemplateService} from 'src/app/service/mail-template.service'
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-add-mail-template',
  templateUrl: './add-mail-template.component.html',
  styleUrls: ['./add-mail-template.component.css']
})
export class AddMailTemplateComponent implements OnInit {

  message = ""
  error = ""
  submit = false

  addMail : FormGroup

  defaultTemplate = '<p>Forgot Password</p>\
  <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">\
    <tbody>\
      <tr>\
        <td>\
        <table border="0" cellpadding="30" cellspacing="0" style="width:600px">\
          <tbody>\
            <tr>\
              <td style="background-color:#ffffff; border-color:#dce1e5; border-style:solid; border-width:1px">\
              <table border="0" cellpadding="0" cellspacing="0" style="width:100%">\
                <tbody>\
                  <tr>\
                    <td style="vertical-align:top">\
                    <h2>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span class="marker">{{SUBJECT}}</span></h2>\
                    </td>\
                  </tr>\
                  <tr>\
                    <td style="border-bottom:1px solid #dce1e5; border-top:1px solid #dce1e5; vertical-align:top">\
                    <p><strong>&nbsp; &nbsp;Username:</strong> {{USER_NAME}}</p>\
                    <p><strong>&nbsp; &nbsp;E-mail:</strong> {{EMAIL}}</p>\
                    </td>\
                  </tr>\
                  <tr>\
                    <td style="vertical-align:top">\
                    <p><br />\
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ...... Forgot Password Link is Below .......</p>\
                    </td>\
                  </tr>\
                  <tr>\
                    <td style="vertical-align:top">\
                    <h3>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<a href="{{RESETLINK}}">Change my password</a></h3>\
                    </td>\
                  </tr>\
                </tbody>\
              </table>\
              </td>\
            </tr>\
          </tbody>\
        </table>\
        </td>\
      </tr>\
    </tbody>\
  </table>\
  '
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
    private clipboardService: ClipboardService
  ) { }

  ngOnInit(): void {
    this.addMail = this.fb.group({
      template_name : ['', Validators.required],
      subject : ['', Validators.required],
      description : [this.defaultTemplate, Validators.required],
      status : [true]
    });
  }

  get f() {
    return this.addMail.controls;
  }

  onSubmit() {
    this.submit = true;
    if(this.addMail.invalid) {
      console.log("Here")
      return false;
    }
    console.log(this.addMail.value)
    this.mailTemplateService.addMailTemplate(this.addMail.value).pipe(first()).subscribe({
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

  public onChange( event: CKEditor4.EventInfo ) {
    console.log( event.editor.getData() );
  } 

  addName() {
    var findStr = "USER_NAME";
    if(this.defaultTemplate.includes(findStr)) {
      var replaceStr = this.defaultTemplate.replace(findStr, 'user_name');
      this.defaultTemplate = replaceStr;
      this.addMail.controls['description'].setValue(replaceStr);
      this.nameFind = true;
    } else {
      var replaceStr = this.defaultTemplate.replace('user_name', findStr);
      this.defaultTemplate = replaceStr;
      this.addMail.controls['description'].setValue(replaceStr);
      this.nameFind = false;
    }
  }

  addEmailAddress() {
    var findStr = "EMAIL";
    if(this.defaultTemplate.includes(findStr)) {
      var replaceStr = this.defaultTemplate.replace(findStr, 'email');
      this.defaultTemplate = replaceStr;
      this.addMail.controls['description'].setValue(replaceStr);
      this.emailFind = true;
    } else {
      var replaceStr = this.defaultTemplate.replace('email', findStr);
      this.defaultTemplate = replaceStr;
      this.addMail.controls['description'].setValue(replaceStr);
      this.emailFind = false;
    }
  }

  addSubject() {
    var findStr = "SUBJECT";
    if(this.defaultTemplate.includes(findStr)) {
      var replaceStr = this.defaultTemplate.replace(findStr, 'subject');
      this.defaultTemplate = replaceStr;
      this.addMail.controls['description'].setValue(replaceStr);
      this.subjectFind = true;
    } else {
      var replaceStr = this.defaultTemplate.replace('subject', findStr);
      this.defaultTemplate = replaceStr;
      this.addMail.controls['description'].setValue(replaceStr);
      this.subjectFind = false;
    }
  }

  addResetLink() {
    var findStr = "RESETLINK";
    if(this.defaultTemplate.includes(findStr)) {
      var replaceStr = this.defaultTemplate.replace(findStr, 'link');
      this.defaultTemplate = replaceStr;
      this.addMail.controls['description'].setValue(replaceStr);
      this.resetLink = true;
    } else {
      var replaceStr = this.defaultTemplate.replace('link', findStr);
      this.defaultTemplate = replaceStr;
      this.addMail.controls['description'].setValue(replaceStr);
      this.resetLink = false;
    }
  }

  copyContent(text) {
    this.defaultKey.forEach(element => {
      if(element.value === text) {
        element.active = true;
        this.clipboardService.copyFromContent('{{'+element.value+'}}');
      } 
      if(element.value != text) {
        element.active = false;
      }
    })
  }
}
