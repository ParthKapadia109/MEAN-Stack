import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private subject = new Subject<any>();
  private navbar = new Subject<any>();
  private logo = new Subject<any>();
  private footer = new Subject<any>();

  themeColorChanging(color : any) {
    this.subject.next(color);
  }

  logoColorChanging(color : any) {
    this.logo.next(color);
  }

  navbarColorChanging(color : any) {
    this.navbar.next(color);
  }

  footerColorChanging(color : any) {
    this.footer.next(color);
  }

  onChangeThemeColor(): Observable<any> {
    return this.subject.asObservable();
  }

  onNavBarThemeColor(): Observable<any> {
    return this.navbar.asObservable();
  }

  onLogoThemeColor(): Observable<any> {
    return this.logo.asObservable();
  }

  onFooterThemeColor() : Observable<any> {
    return this.footer.asObservable();
  }
}
