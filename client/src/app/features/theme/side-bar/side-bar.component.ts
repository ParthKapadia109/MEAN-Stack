import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment  } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/service/theme.service';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  userName = "";
  roleSlug = "";
  userSlug = "";
  userPermission : any = [];
  currentUserPermission : any = [];

  subscription: Subscription;
  logo= "brand-link"
  sidebar = "main-sidebar elevation-4 sidebar-dark-primary"

  navItems : any

  constructor(
    private router : Router,
    private themeService : ThemeService,
    private cookieService: CookieService,
    private actRoute : ActivatedRoute,
    public translate: TranslateService 
  ) {
    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');



    this.subscription = this.themeService.onChangeThemeColor().subscribe(color => {
        this.sidebar = "main-sidebar elevation-4 sidebar-"+color.sideBar
    })

    this.subscription = this.themeService.onLogoThemeColor().subscribe(color => {
      this.logo = "brand-link "+color.logo;
    })
  }

  ngOnInit(): void {

    const userIsLogging = this.cookieService.get('USER_DATA');
    if(userIsLogging) {
      let dataArr : any = JSON.parse(atob(userIsLogging));
      this.userName = dataArr.user_name;
      this.roleSlug = dataArr.role;
      this.userSlug = dataArr.user_slug;
      this.userPermission = dataArr.permission;
      this.userPermission.forEach(element => {
        element.sub_module.forEach(ele => {
          this.currentUserPermission.push(ele.sub_module_slug);
        })
      });
      if(dataArr.sidebar_toggle) {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('sidebar-collapse');
      }
    }
    const segments = this.actRoute.snapshot.routeConfig.path;
    // const segments: UrlSegment[] = this.actRoute.snapshot.url;
    this.getRouteActived(segments);
    // this.getRouteActived(segments[0].path);

  }

  getRouteActived(route) {
    this.navItems = [
      {
        displayName : 'DASHBOARD',
        iconName : "fas fa-tachometer-alt",
        routeName : '/admin/dashboard',
        active : route == 'admin/dashboard' ? true : false,
        permission : true
      },
      {
        displayName : "USER",
        iconName : "fas fa-users",
        routeName : '/admin/user',
        active : route == 'admin/user' ? true : false,
        permission : this.currentUserPermission.includes('view-user') || this.currentUserPermission.includes('add-user') ? true : false
      },
      {
        displayName : "Roles",
        iconName : "fas fa-list-alt",
        routeName : '/admin/role',
        active : route == 'admin/role' ? true : false,
        permission : this.currentUserPermission.includes('view-role') || this.currentUserPermission.includes('add-role') ? true : false
      },
      {
        displayName : "MODULE",
        iconName : "fas fa-tasks",
        routeName : '/admin/module',
        active : route == 'admin/module' ? true : false,
        permission : this.currentUserPermission.includes('view-module') || this.currentUserPermission.includes('add-module') ? true : false
      },
      {
        displayName : "SETTING",
        iconName : "fas fa-cogs",
        routeName : '#',
        active : route == 'admin/configuration' || route == 'admin/cms' ? true : false || route == 'admin/mail-template',
        // active : route == 'admin/configuration' || route == 'admin/role' || route == 'admin/module' || route == 'admin/cms' ? true : false || route == 'admin/mail-template',
        // permission : true,
        permission : this.currentUserPermission.includes('view-cms') || this.currentUserPermission.includes('add-cms') || this.currentUserPermission.includes('view-mail-template') || this.currentUserPermission.includes('add-mail-template') ? true : false,
        // permission : this.currentUserPermission.includes('view-role') || this.currentUserPermission.includes('add-role') || this.currentUserPermission.includes('view-module') || this.currentUserPermission.includes('add-module') || this.currentUserPermission.includes('view-cms') || this.currentUserPermission.includes('add-cms') || this.currentUserPermission.includes('view-mail-template') || this.currentUserPermission.includes('add-mail-template') ? true : false,
        child : [
          // {
          //   displayName : "Roles",
          //   iconName : "fas fa-list-alt",
          //   routeName : 'admin/role',
          //   active : route == 'admin/role' ? true : false,
          //   permission : this.currentUserPermission.includes('view-role') || this.currentUserPermission.includes('add-role') ? true : false
          // },
          // {
          //   displayName : "MODULE",
          //   iconName : "fas fa-tasks",
          //   routeName : 'admin/module',
          //   active : route == 'admin/module' ? true : false,
          //   permission : this.currentUserPermission.includes('view-module') || this.currentUserPermission.includes('add-module') ? true : false
          // },
          {
            displayName : "CMS",
            iconName : "fas fa-file-alt",
            routeName : 'admin/cms',
            active : route == 'admin/cms' ? true : false,
            permission : this.currentUserPermission.includes('view-cms') || this.currentUserPermission.includes('add-cms') ? true : false
          },
          {
            displayName : "Mail Templates",
            iconName : "fas fa-envelope",
            routeName : 'admin/mail-template',
            active : route == 'admin/mail-template' ? true : false,
            permission : this.currentUserPermission.includes('view-mail-template') || this.currentUserPermission.includes('add-mail-template') ? true : false
          },
          {
            displayName : "Configuration",
            iconName : "fas fa-sliders-h",
            routeName : 'admin/configuration',
            active : route == 'admin/configuration' ? true : false,
            permission : this.userSlug === 'supper-admin' && this.roleSlug === 'Supper Admin' ? true : false
          }          
        ]
      }
    ]
  }

  logout() {
    const signOut = confirm("Are you sure you want to sign out?");
    if(signOut == true) {
      this.cookieService.delete('USER_DATA');
      this.cookieService.delete('SESSION_TOKEN');
      this.cookieService.delete('CUSTOM_THEME');
      // localStorage.removeItem('USER_DATA');
      localStorage.removeItem('loggedinUser');
      alert('you have successfully logout.');
      this.router.navigate(['/admin/login']);
    }
  }

}
