import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrontNavBarService {

  private navBarSlug = new Subject<any>();

  constructor() { }

  navBarChanging(slug : any) {
    this.navBarSlug.next(slug);
  }

  onChangeNavBar(): Observable<any> {
    return this.navBarSlug.asObservable();
  }
}
