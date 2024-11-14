import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-front-profile',
  templateUrl: './front-profile.component.html',
  styleUrls: ['./front-profile.component.css']
})
export class FrontProfileComponent implements OnInit {

  _id = ""
  name = ""
  email = ""
  userSlug = ""

  constructor(
    private cookieService : CookieService
  ) { }

  ngOnInit(): void {
    const userData = this.cookieService.get('front_user_data');
    if(userData) {
      const data : any = JSON.parse(atob(userData));
      this._id = data._id;
      this.name = data.user_name;
      this.email = data.email;
      this.userSlug = data.user_slug;
    }
  }

}
