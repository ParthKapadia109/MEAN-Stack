import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import { UserService } from '../../../service/user.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

declare var $ : any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  temp = []
  userData : any = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  
  message = "";
  currentUserSlug = ""; 
  currentUserPermission : any = [];

  constructor(
    private userService : UserService,
    private router : Router,
    private cookieService: CookieService
  ) { }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $('.ngx-datatable.bootstrap .datatable-footer').css('background','#007bff');
    $('.empty-row').css('text-align','center');
    $('.ngx-datatable.bootstrap .datatable-header .datatable-header-cell').css('font-weight','bold');
  }
  ngOnInit(): void {
    let user_slug = ""
    const currentUserData = this.cookieService.get('USER_DATA');
    if(currentUserData) {
      let dataArr : any = JSON.parse(atob(currentUserData));
      const permission = dataArr.permission;
      permission.forEach(element => {
        if(element.module_slug == 'user' && element.title == 'User') {
          user_slug = element.module_slug 
          element.sub_module.forEach(ele => {
            this.currentUserPermission.push(ele.sub_module_slug);
          })
        }
      });
      this.currentUserSlug = dataArr.user_slug;
    }
    if(user_slug == 'user') {
      if(this.currentUserPermission.includes('view-user')) {
        this.getAllUser();
      }
    } else {
      this.router.navigate(['/admin/error-403'])
    }
  }

  getAllUser() {
    this.userService.getAllUser().pipe(first()).subscribe({
      next : data => {
        const user_data : any = data;
        if(user_data.response) {
          this.userData = user_data.data
          this.temp = user_data.data
        } else {
          console.log(user_data);
        }
      },
      error : error => {
        console.log(error);
      }
    })
  }

  deleteUser(slug) {
    const con = confirm('Are you sure you want to delete user ?');
    if(con) {
      this.userService.deleteUser(slug).pipe(first()).subscribe({
        next : data => {
          const userDelete : any = data;
          if(userDelete.response) {
            this.message = userDelete.message;
            setTimeout(() => {
              this.getAllUser()
              this.message = ""
            }, 3000);
          } else {
            console.log(userDelete);
          }
        },
        error : error => {
          console.log(error);
        }
      })
    }
  }

  checkedSwitch(status) {
    if(status) {
      return true;
    } else {
      return false;
    }
  }

  onChangeStatus(_id, slug, status){
    
    const data = {
      _id : _id,
      status : status ? false : true,
      slug : slug
    }

    console.log(data);

    this.userService.changeStatus(data).pipe(first()).subscribe({
      next : data => {
        const userStatusChange : any = data
        if(userStatusChange.response) {
          this.message = userStatusChange.message
          setTimeout(() => {
            this.getAllUser();
            this.message = ""
          }, 2200);
        } else {
          console.log(userStatusChange)
        }
      },
      error : error => {
        console.log(error);
      }
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.user_name.toLowerCase().indexOf(val) !== -1 || d.email.toLowerCase().indexOf(val) !== -1 || d.role.toLowerCase().indexOf(val) !== -1 || d.user_slug.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.userData = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
