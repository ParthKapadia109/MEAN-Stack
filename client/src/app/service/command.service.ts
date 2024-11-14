import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private http : HttpClient,
    private cookieService: CookieService
  ) { 
  }

  headersCommon(header : HttpHeaders) {
    header.append('Access-Control-Allow-Origin', '*')
  }

  login(url, data) {
    let headers = new HttpHeaders();
    this.headersCommon(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  frontPost(url, data) {
    let headers = new HttpHeaders();
    this.headersCommon(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  demo(url) {
    let headers = new HttpHeaders();
    this.headersCommon(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new HttpHeaders();
    const token = atob(this.cookieService.get('SESSION_TOKEN'));
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token}`); 
    this.headersCommon(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  get(url) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    const token = atob(this.cookieService.get('SESSION_TOKEN'));
    headers = headers.append('Authorization', `Bearer ${token}`); 
    this.headersCommon(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  put(url, data) {
    const token = atob(this.cookieService.get('SESSION_TOKEN'));
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token}`); 
    this.headersCommon(headers);
    return this.http.put(url, data, {
      headers: headers
    });
  }

  delete(url) {
    const token = atob(this.cookieService.get('SESSION_TOKEN'));
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token}`); 
    this.headersCommon(headers);
    return this.http.delete(url, {
      headers: headers
    });
  }

  putFront(url, data) {
    const token = atob(this.cookieService.get('front_session_token'));
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token}`); 
    this.headersCommon(headers);
    return this.http.put(url, data, {
      headers: headers
    });
  }
}
