import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/service/user.service';
import { LanguageService } from 'src/app/service/language.service';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {


  default_accent_color = "text-primary"
  default_brand_logo_color = ""
  default_sidebar_color = "dark-primary"
  default_navbar_color = "navbar-white";

  accent_color = "text-primary";
  sidebar_color = "dark-primary";
  brand_logo_color = "";
  navbar_color = "navbar-primary";

  sidebar_type = "dark";
  aside_none = false;
  aside_display = ""; 
  aside_right = "";
  message = '';
  status = false;
  is_selected = false;
  user = {};
  translateLanguage = [];

  customie_toggle_open = false;
  customie_toggle_close = false;


  subscription: Subscription;
  header = "main-header navbar navbar-expand navbar-white navbar-light";
  constructor(
    private userService : UserService,
    private themeService : ThemeService,
    private cookieService: CookieService,
    public translate: TranslateService, 
    private languageService : LanguageService,
  ) {
    this.user = JSON.parse(localStorage.getItem('loggedinUser'));
    this.translate.addLangs(['en', 'fr', 'es']);
    this.translate.setDefaultLang('en');
    const data= {
      uid : this.user['_id']
    };
    this.languageService.getLanguage(data).pipe(first()).subscribe({
      next : data => {
        const selected_languagesRes : any = data;
        console.log("selected_languagesRes :", selected_languagesRes);
        if(selected_languagesRes.response) {
          // const browserLang = this.translate.getBrowserLang();
          this.translate.use(selected_languagesRes.data[0].value);
        } else {
          console.log(selected_languagesRes);
        }
      },
      error : error => {
        console.log(error);
      }
    });

    this.subscription = this.themeService.onNavBarThemeColor().subscribe(color => {
      const navBarColor = color.navBar
      if(navBarColor != '') {
        this.header = "main-header navbar navbar-expand navbar-light " + color.navBar
     }
    })
  }

  ngOnInit(): void {
    this.customTheme()
  }

  changeLanguage(value) {
    const language_data= {
      uid : this.user['_id'],
      value: value,
    };
    this.languageService.addSelectedLanguage(language_data).pipe(first()).subscribe({
      next : data => {
        const submitData : any = data;
        if(submitData.response) {
          this.message = submitData.message;
          this.translate.use(value);
        } else {
          console.log(submitData);
        }
      }, 
      error : error => {
        console.log(error);
      }
    })

  }

  toggleUpdate() {
    const userIsLogging = this.cookieService.get('USER_DATA');
    if(userIsLogging) {
      let dataArr : any = JSON.parse(atob(userIsLogging));
      console.log(dataArr)
      const _id = dataArr._id;
      let toggle = dataArr.sidebar_toggle
      if(dataArr.sidebar_toggle) {
        toggle = false;
      } else {
        toggle = true;
      }     
      const data = {
        _id : _id,
        sidebar_toggle : toggle
      }
      this.userService.toggleUpdate(data).pipe(first()).subscribe({
        next : data => {
          const toggleRes : any = data;
          if(toggleRes.response) {
            const newArr = {
              email: dataArr.email,
              permission: dataArr.permission,
              role: dataArr.role,
              sidebar_toggle: toggle,
              user_name: dataArr.user_name,
              user_slug: dataArr.user_slug,
              _id: _id,
            }
            this.cookieService.set('USER_DATA', btoa(JSON.stringify(newArr)));
            // location.reload();
          }
        },
        error : error => {
          console.log(error)
        }
      })
    }
  }

  navColorChange(className) {
    this.navbar_color = className;
    const navColor = {
      navBar: className
    }
    this.themeService.navbarColorChanging(navColor);
  }

  sideBarColorChange(className) {
    this.sidebar_color = className

    this.sidebar_type = this.sidebar_color.split("-")[0];

    const sideColor = {
      sideBar: className
    }
    this.themeService.themeColorChanging(sideColor);
  }

  footerColorChange(className) {
    this.accent_color = className;
    const footerColor = {
      footer : className
    }
    this.themeService.footerColorChanging(footerColor);
  }

  logoColorChange(className) {
    this.brand_logo_color = className;
    const logoColor = {
      logo: className
    }
    this.themeService.logoColorChanging(logoColor);
  }

  saveCustomTheme() {
    const userIsLogging = this.cookieService.get('USER_DATA');
    if (userIsLogging) {
      let dataArr: any = JSON.parse(atob(userIsLogging));
      const _id = dataArr._id;
      const _slug = dataArr.user_slug;

      const _theme = {
        id: _id,
        user_slug: _slug,
        custom_theme: {
          accent_color: this.accent_color,
          navbar_color: this.navbar_color,
          sidebar_color: this.sidebar_color,
          brand_logo_color: this.brand_logo_color
        }
      }

      this.userService.customThemeAPI(_theme).pipe(first()).subscribe({
        next: data => {
          const themeResponse : any = data;
          if(themeResponse.response) {
            let expire = new Date();
            var time = Date.now() + ((3600 * 1000) * 1);
            expire.setTime(time);
            const custom_theme = [{
              accent_color: this.accent_color,
              navbar_color: this.navbar_color,
              sidebar_color: this.sidebar_color,
              brand_logo_color: this.brand_logo_color
            }]
            this.cookieService.set('CUSTOM_THEME', btoa(JSON.stringify(custom_theme)), expire);
            // this.aside_none = true;
            // this.aside_display = "none";
            // this.aside_right = "";
            this.customie_toggle_close = true;
            this.customie_toggle_open = false;
            alert(themeResponse.message)
          }
        }, error: error => {
          console.log(error)
        }
      })

    }
  }

  setDefaultTheme() {
    const con = confirm("Are you sure that use Default Theme ?");
    if (con) {
      this.footerColorChange(this.default_accent_color);
      this.sideBarColorChange(this.default_sidebar_color);
      this.logoColorChange(this.default_brand_logo_color);
      this.navColorChange(this.default_navbar_color);

      const userIsLogging = this.cookieService.get('USER_DATA');
      if (userIsLogging) {
        let dataArr: any = JSON.parse(atob(userIsLogging));
        const _id = dataArr._id;
        const _slug = dataArr.user_slug;

        const _theme = {
          id: _id,
          user_slug: _slug,
          custom_theme: {
            accent_color: this.default_accent_color,
            navbar_color: this.default_navbar_color,
            sidebar_color: this.default_sidebar_color,
            brand_logo_color: this.default_brand_logo_color
          }
        }

        this.userService.customThemeAPI(_theme).pipe(first()).subscribe({
          next: data => {
            const themeResponse : any = data;
            if(themeResponse.response) {
              let expire = new Date();
              var time = Date.now() + ((3600 * 1000) * 1);
              expire.setTime(time);
              const custom_theme = [{
                accent_color: this.default_accent_color,
                navbar_color: this.default_navbar_color,
                sidebar_color: this.default_sidebar_color,
                brand_logo_color: this.default_brand_logo_color
              }]
              this.cookieService.set('CUSTOM_THEME', btoa(JSON.stringify(custom_theme)), expire);
              this.customie_toggle_close = true;
              this.customie_toggle_open = false;
              alert("Successfully set the Default theme.")
            }
          }, error: error => {
            console.log(error)
          }
        })

      }
    }
  }

  customTheme(){
    const custom_theme = JSON.parse(atob(this.cookieService.get("CUSTOM_THEME")));
    if(custom_theme.length == 0) {
      this.footerColorChange(this.default_accent_color);
      this.sideBarColorChange(this.default_sidebar_color);
      this.logoColorChange(this.default_brand_logo_color);
      this.navColorChange(this.default_navbar_color); 
    } else {
      this.footerColorChange(custom_theme[0].accent_color);
      this.sideBarColorChange(custom_theme[0].sidebar_color);
      this.logoColorChange(custom_theme[0].brand_logo_color);
      this.navColorChange(custom_theme[0].navbar_color);
    }
      
  }

  customizeToggle(){
    // if(this.aside_none) {
    //   this.aside_none = false;
    // }
    // if(this.aside_right == "") {
    //   this.aside_right = 'right: 0px; transition: right .3s ease-in-out,display .3s ease-in-out;'
    // } else {
    //   this.aside_right = "";
    // }

    if(this.customie_toggle_open) {
      this.customie_toggle_close = true;
      this.customie_toggle_open = false;
    } else if(this.customie_toggle_close) {
      this.customie_toggle_close = false;
      this.customie_toggle_open = true;
    } else {
      this.customie_toggle_open = true;
    }
  }
}
