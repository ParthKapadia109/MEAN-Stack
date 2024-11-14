import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CmsService } from '../../../service/cms.service';
import { CookieService } from 'ngx-cookie-service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

declare var $ : any;
@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CmsComponent implements OnInit {

  rows : any = []
  temp : any = []
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  message = ""
  error = ""

  currentUserPermission : any = []
  constructor(
    private cmsService : CmsService,
    private router : Router,
    private cookieService : CookieService
  ) { }

  ngOnInit(): void {
    let cms_slug = "";
    const currentUserData = this.cookieService.get('USER_DATA');
    if(currentUserData) {
      let dataArr : any = JSON.parse(atob(currentUserData));
      const permission = dataArr.permission;
      permission.forEach(element => {
        if(element.module_slug == 'cms' && element.title == 'CMS') {
          cms_slug = element.module_slug 
          element.sub_module.forEach(ele => {
            this.currentUserPermission.push(ele.sub_module_slug);
          })
        }
      });
    }
    // console.log(this.currentUserPermission)
    if(cms_slug == 'cms') {
      if(this.currentUserPermission.includes('view-cms')) {
        this.getCMSData();
      }
    } else {
      this.router.navigate(['/admin/error-403'])
    }
    // this.getCMSData()
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $('.ngx-datatable.bootstrap .datatable-footer').css('background','#007bff');
  }

  getCMSData() {
    this.cmsService.getCMS().pipe(first()).subscribe({
      next : data => {
        const cmsData : any = data
        if(cmsData.response) {
          // cmsData.data.forEach(element => {
          //   const desc = element.description.substr(0, 200);
          //   const data = {
          //     title : element.title,
          //     hading : element.hading,
          //     description : desc,
          //     header : element.header,
          //     footer : element.footer,
          //     status : element.status,
          //     _id : element._id,
          //     slug : element.slug
          //   }

          //   // this.rows.push(data);
          // });
          this.rows = cmsData.data;
          this.temp = this.rows
          console.log(this.temp)
        }
      },
      error : error => {
        console.log(error)
      }
    })
  }

  deleteCMS(slug, _id) {
    const conf = confirm("Are you sure to deleted?");
    if(conf) {
      this.cmsService.deleteCMS(slug, _id).pipe(first()).subscribe({
        next : data => {
          const deleteRes : any = data;
          if(deleteRes.response) {
            this.message = deleteRes.message
            setTimeout(() => {
              this.rows = []
              this.getCMSData()
            }, 3000);
          } else {
            this.error = deleteRes.error
          }         
        },
        error : error => {
          console.log(error)
        }
      })
    }
  }

  onChangeStatus(_id, status, header, footer, field){
    
    let data = {
      _id : _id,
      status : status,
      header : header,
      footer : footer
    }

    if(field == "Header") {
      data.header = header ? false : true;
    } else if (field == "Footer") {
      data.footer = footer ? false : true;
    } else if (field == "Status") {
      data.status = status ? false : true;
    }

    this.cmsService.changeStatus(data).pipe(first()).subscribe({
      next : data => {
        const roleStatusChange : any = data
        if(roleStatusChange.response) {
          this.message = roleStatusChange.message
          setTimeout(() => {
            this.getCMSData();
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

  checkedSwitch(status) {
    if(status) {
      return true;
    } else {
      return false;
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    console.log("filter value :", val);
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.title.toLowerCase().indexOf(val) !== -1 || d.description.toLowerCase().indexOf(val) !== -1 || d.hading.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
