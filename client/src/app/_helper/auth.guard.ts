import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router : Router,
    private cookieService: CookieService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
     const userIsLogging =  this.cookieService.get('USER_DATA');
     const token = this.cookieService.get('SESSION_TOKEN');
     if(userIsLogging && token) {
       return true;
     } else {
       this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
       return false;
     }
  }
  
}
