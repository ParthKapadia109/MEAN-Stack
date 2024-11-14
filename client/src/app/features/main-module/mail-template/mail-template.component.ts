import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { first } from 'rxjs/operators';
import { MailTemplateService } from 'src/app/service/mail-template.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.css']
})
export class MailTemplateComponent implements OnInit {

  mailData : any = []
  temp : any = []
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  error = ""
  message = ""

  currentUserPermission : any = []

  constructor(
    private mailTemplateService : MailTemplateService,
    private cookieService : CookieService,
    private router : Router
  ) { }

  ngOnInit(): void {
    // this.getMailData()

    let mail_slug = "";
    const currentUserData = this.cookieService.get('USER_DATA');
    if(currentUserData) {
      let dataArr : any = JSON.parse(atob(currentUserData));
      const permission = dataArr.permission;
      permission.forEach(element => {
        if(element.module_slug == 'mail-template' && element.title == 'Mail Template') {
          mail_slug = element.module_slug 
          element.sub_module.forEach(ele => {
            this.currentUserPermission.push(ele.sub_module_slug);
          })
        }
      });
    }
    // console.log(this.currentUserPermission)
    if(mail_slug == 'mail-template') {
      if(this.currentUserPermission.includes('view-mail-template')) {
        this.getMailData()
      }
    } else {
      this.router.navigate(['/admin/error-403'])
    }
  }

  getMailData(){
    this.mailTemplateService.getMailTemplate().pipe(first()).subscribe({
      next : data => {
        const mail : any = data
        if(mail.response) {
          this.mailData = mail.data;
          this.temp = mail.data;
        } else {
          this.error = mail.message
        }
      },
      error : error => {
        console.log("error : ", error);
      }
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    console.log("filter value :", val);
    const temp = this.temp.filter(function (d) {
      return d.title.toLowerCase().indexOf(val) !== -1 || d.description.toLowerCase().indexOf(val) !== -1 || d.hading.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.mailData = temp;
    this.table.offset = 0;
  }

  checkedSwitch(status){
    if(status) {
      return true;
    } else {
      return false;
    }
  }

  onChangeStatus(id, status){
    const data = {
      status : status ? false : true
    }

    this.mailTemplateService.changeStatus(id, data).pipe(first()).subscribe({
      next : data => {
        const mail : any = data;
        if(mail.response) {
          this.message = mail.message
          setTimeout(() => {
            this.getMailData();
            this.message = ""
          }, 2000);
        } else {
          this.error = mail.message
          setTimeout(() => {
            this.error = ""
          }, 5000);
        }
      },
      error : error => {
        console.log(error);
      }
    })
  }

  deleteMailTemplate(id) {
    const con = confirm('Are you sure you want to delete template ?');
    if (con) {
      this.mailTemplateService.deleteMailDetail(id).pipe(first()).subscribe({
        next: data => {
          const mail: any = data;
          if (mail.response) {
            this.message = mail.message
            setTimeout(() => {
              this.getMailData();
              this.message = ""
            }, 2000);
          } else {
            this.error = mail.message
            setTimeout(() => {
              this.error = ""
            }, 5000);
          }
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }

}
