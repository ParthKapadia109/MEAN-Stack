import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class FrontAuthGuard implements CanActivate {
  constructor(
    private router : Router,
    private cookieService: CookieService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
     const userIsLogging =  this.cookieService.get('front_user_data');
     const token = this.cookieService.get('front_session_token');
     if(userIsLogging && token) {
       return true;
     } else {
       this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
       return false;
     }
  }
  
}
