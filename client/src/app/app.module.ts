import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { NavBarComponent } from './features/theme/nav-bar/nav-bar.component';
import { SideBarComponent } from './features/theme/side-bar/side-bar.component';
import { FooterComponent } from './features/theme/footer/footer.component';
import { DashboardComponent } from './features/main-module/dashboard/dashboard.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleComponent } from './features/main-module/role/role.component';
import { UserComponent } from './features/main-module/user/user.component';
import { AddUserComponent } from './features/main-module/user/add-user/add-user.component';
import { EditUserComponent } from './features/main-module/user/edit-user/edit-user.component';
import { ModuleComponent } from './features/main-module/module/module.component';
import { ModulePermissionComponent } from './features/main-module/module-permission/module-permission.component';
import { UserPermissionComponent } from './features/main-module/user/user-permission/user-permission.component';
import { ProfileComponent } from './features/main-module/user/profile/profile.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgetPasswordComponent } from './features/auth/forget-password/forget-password.component';
import { RecoverPasswordComponent } from './features/auth/recover-password/recover-password.component';
import { Error403Component } from './features/error-page/error403/error403.component';
import { LandingPageComponent } from './features/main-module/landing-page/landing-page.component';
import { OnlyLetterDirective } from './_directive/only-letter.directive';
import { CmsComponent } from './features/main-module/cms/cms.component';
import { AddCmsComponent } from './features/main-module/cms/add-cms/add-cms.component';

import { QuillModule } from 'ngx-quill';
import { EditCmsComponent } from './features/main-module/cms/edit-cms/edit-cms.component';
import { PagesComponent } from './features/main-module/landing-page/pages/pages.component'


import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { FrontRegisterComponent } from './features/main-module/landing-page/front-register/front-register.component';
import { FrontNavbarComponent } from './features/main-module/landing-page/front-navbar/front-navbar.component';
import { FrontFooterComponent } from './features/main-module/landing-page/front-footer/front-footer.component';
import { FrontProfileComponent } from './features/main-module/landing-page/front-profile/front-profile.component';
import { EditProfileComponent } from './features/main-module/landing-page/front-profile/edit-profile/edit-profile.component';

import { ChartsModule } from 'ng2-charts';

// Datatable Library
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MailTemplateComponent } from './features/main-module/mail-template/mail-template.component';
import { AddMailTemplateComponent } from './features/main-module/mail-template/add-mail-template/add-mail-template.component';
import { EditMailTemplateComponent } from './features/main-module/mail-template/edit-mail-template/edit-mail-template.component';

import { CKEditorModule } from 'ckeditor4-angular';
import { ClipboardModule } from 'ngx-clipboard';
import { Error404Component } from './features/error-page/error404/error404.component';
import { MailSettingsComponent } from './features/main-module/mail-settings/mail-settings.component';
import { ConfigurationComponent } from './features/main-module/configuration/configuration.component';
import { AccountActivationComponent } from './features/auth/account-activation/account-activation.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    SideBarComponent,
    FooterComponent,
    DashboardComponent,
    RoleComponent,
    UserComponent,
    AddUserComponent,
    EditUserComponent,
    ModuleComponent,
    ModulePermissionComponent,
    UserPermissionComponent,
    ProfileComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    RecoverPasswordComponent,
    Error403Component,
    LandingPageComponent,
    OnlyLetterDirective,
    CmsComponent,
    AddCmsComponent,
    EditCmsComponent,
    PagesComponent,
    FrontRegisterComponent,
    FrontNavbarComponent,
    FrontFooterComponent,
    FrontProfileComponent,
    EditProfileComponent,
    MailTemplateComponent,
    AddMailTemplateComponent,
    EditMailTemplateComponent,
    Error404Component,
    MailSettingsComponent,
    ConfigurationComponent,
    AccountActivationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ChartsModule,
    QuillModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxDatatableModule,
    CKEditorModule,
    ClipboardModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
