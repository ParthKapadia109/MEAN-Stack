import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MailSettingService } from 'src/app/service/mail-setting.service';

@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.css']
})
export class MailSettingsComponent implements OnInit {

  mailConfigForm : FormGroup
  message = ""
  error = ""
  submit = false
  emailPattern = "^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(
    private fb: FormBuilder,
    private mailSettingService : MailSettingService
  ) { }

  ngOnInit(): void {
    this.mailConfigForm = this.fb.group({
      service: ['', Validators.required],
      host: [''],
      port: ['', Validators.required],
      secure: [false , Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', Validators.required]
    });
    this.getMailConfiguration();
  }

  get f() {
    return this.mailConfigForm.controls;
  }

  getMailConfiguration() {
    this.mailSettingService.getMailConfiguration().pipe(first()).subscribe({
      next: data => {
        const mailConfig: any = data;
        if (mailConfig.response) {
          this.mailConfigForm.controls['service'].setValue(mailConfig.data.service);
          this.mailConfigForm.controls['host'].setValue(mailConfig.data.host);
          this.mailConfigForm.controls['port'].setValue(mailConfig.data.port);
          this.mailConfigForm.controls['secure'].setValue(mailConfig.data.secure);
          this.mailConfigForm.controls['email'].setValue(mailConfig.data.email);
          this.mailConfigForm.controls['password'].setValue(mailConfig.data.password);
        } else {
          this.error = mailConfig.message;
          setTimeout(() => {
            this.error = ""
          }, 3000);
        }
      },
      error: error => {
        console.log(error);
      }
    })
  }

  onUpdate() {
    this.submit = true;
    if (this.mailConfigForm.invalid) {
      return false;
    }
    this.mailSettingService.mailConfiguration(this.mailConfigForm.value).pipe(first()).subscribe({
      next: data => {
        const mailConfig: any = data;
        if (mailConfig.response) {
          this.message = mailConfig.message
          setTimeout(() => {
            this.message = ""
            this.getMailConfiguration()
          }, 3000);
        } else {
          this.error = mailConfig.message;
          setTimeout(() => {
            this.error = ""
          }, 3000);
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }

  testMailConfiguration() {
    this.mailSettingService.testMailConfiguration().pipe(first()).subscribe({
      next: data => {
        const mailConfig: any = data;
        if (mailConfig.response) {
          this.message = mailConfig.message
          setTimeout(() => {
            this.message = ""
          }, 3000);
        } else {
          this.error = mailConfig.message;
          setTimeout(() => {
            this.error = ""
          }, 3000);
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }

}
