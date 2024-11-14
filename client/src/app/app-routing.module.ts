import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./features/auth/login/login.component";
import { DashboardComponent } from './features/main-module/dashboard/dashboard.component';
import { ModulePermissionComponent } from './features/main-module/module-permission/module-permission.component';
import { ModuleComponent } from './features/main-module/module/module.component';
import { RoleComponent } from './features/main-module/role/role.component';
import { UserPermissionComponent } from './features/main-module/user/user-permission/user-permission.component';
import { AddUserComponent } from './features/main-module/user/add-user/add-user.component';
import { EditUserComponent } from './features/main-module/user/edit-user/edit-user.component';
import { UserComponent } from './features/main-module/user/user.component';
import { AuthGuard } from './_helper/auth.guard';
import { ProfileComponent } from './features/main-module/user/profile/profile.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgetPasswordComponent } from './features/auth/forget-password/forget-password.component';
import { RecoverPasswordComponent } from './features/auth/recover-password/recover-password.component';
import { Error403Component } from './features/error-page/error403/error403.component';
import { LandingPageComponent } from './features/main-module/landing-page/landing-page.component';
import { CmsComponent } from './features/main-module/cms/cms.component';
import { AddCmsComponent } from './features/main-module/cms/add-cms/add-cms.component';
import { EditCmsComponent } from './features/main-module/cms/edit-cms/edit-cms.component';
import { PagesComponent } from './features/main-module/landing-page/pages/pages.component';
import { FrontRegisterComponent } from './features/main-module/landing-page/front-register/front-register.component';
import { FrontAuthGuard } from './_helper/front-auth.guard';
import { FrontProfileComponent } from './features/main-module/landing-page/front-profile/front-profile.component';
import { EditProfileComponent } from './features/main-module/landing-page/front-profile/edit-profile/edit-profile.component';
import { MailTemplateComponent } from './features/main-module/mail-template/mail-template.component';
import { AddMailTemplateComponent } from './features/main-module/mail-template/add-mail-template/add-mail-template.component';
import { EditMailTemplateComponent } from './features/main-module/mail-template/edit-mail-template/edit-mail-template.component';
import { Error404Component } from './features/error-page/error404/error404.component';
import { ConfigurationComponent } from './features/main-module/configuration/configuration.component';
import { AccountActivationComponent } from './features/auth/account-activation/account-activation.component';


const routes: Routes = [
  // Admin route
  {
    path : 'admin',
    component : LoginComponent,
    data : {  
      title: 'Login'  
    }
  },
  {
    path : 'admin/login',
    component : LoginComponent,
    data : {  
      title: 'Login'  
    }
  },
  {
    path : 'admin/register',
    component : RegisterComponent,
    data : {  
      title: 'Register'  
    }
  },
  {
    path : 'forgot-password',
    component : ForgetPasswordComponent,
    data : {  
      title: 'Forgot Password'  
    }
  },
  {
    path: 'account-activation',
    component: AccountActivationComponent,
    data: {
      title: 'Account Activation'
    }
  },
  {
    path : 'recover-password/:token/:email',
    component : RecoverPasswordComponent,
    data : {  
      title: 'Recover Password'  
    }
  },
  {
    path : 'admin/dashboard',
    component : DashboardComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Dashboard'
    }
  },
  {
    path : 'admin/role',
    component : RoleComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Roles'
    }
  },
  {
    path : 'admin/user',
    component : UserComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Users'
    }
  },
  {
    path : 'admin/add-user',
    component : AddUserComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Add User'
    }
  },
  {
    path : 'admin/edit-user/:slug',
    component : EditUserComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Edit User'
    }
  },
  {
    path : 'admin/module',
    component : ModuleComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Module'
    }
  },
  {
    path : 'admin/modules-permission/:slug',
    component : ModulePermissionComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Modules Permission'
    }
  },
  {
    path : 'admin/user-permission/:user_slug/:role_slug',
    component : UserPermissionComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'User Permission'
    }
  },
  {
    path : 'admin/profile/:slug',
    component : ProfileComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Profile'
    }
  },
  {
    path : 'admin/error-403',
    component : Error403Component,
    canActivate : [AuthGuard],
    data : {
      title : 'Error 403'
    }
  },
  {
    path : 'admin/cms',
    component : CmsComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'CMS'
    }
  },
  {
    path : 'admin/add-cms',
    component : AddCmsComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Add CMS'
    }
  },
  {
    path : 'admin/edit-cms/:slug/:_id',
    component : EditCmsComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Edit CMS'
    }
  },
  {
    path : 'admin/mail-template',
    component : MailTemplateComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Mail Template'
    }
  },
  {
    path : 'admin/add-mail-template',
    component : AddMailTemplateComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Add Mail Template'
    }
  },
  {
    path : 'admin/edit-mail-template/:slug/:id',
    component : EditMailTemplateComponent,
    canActivate : [AuthGuard],
    data : {
      title : 'Edit Mail Template'
    }
  },
  {
    path: 'admin/configuration',
    component: ConfigurationComponent,
    canActivate: [AuthGuard],
    data: {
      title : 'Setting'
    }
  },

  // Front End Route
  {
    path : '',
    component : LandingPageComponent,
    data : {
      title :  'Landing Page'
    }

  },
  {
    path : 'page/:slug',
    component : PagesComponent,
    data : {
      title :  `Page`
    }
  },
  {
    path : 'register',
    component : FrontRegisterComponent,
    data : {
      title : 'Register'
    }
  },
  {
    path : 'userProfile',
    component : FrontProfileComponent,
    canActivate : [FrontAuthGuard],
    data : {
      title : 'User Profile'
    }
  },
  {
    path : 'userProfile/:id',
    component : EditProfileComponent,
    canActivate : [FrontAuthGuard],
    data : {
      title : 'User Profile'
    }
  },
  {
    path: '404',
    component: Error404Component,
    data : {
      title :  `404 Page`
    }
  },
  {
    path: '**',
    redirectTo: '/404'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
