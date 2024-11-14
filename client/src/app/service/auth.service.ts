import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private config : CommandService,
    private http: HttpClient
  ) { }

  authentication(data) {
    return this.config.login(`${environment.apiURL}login`, data).pipe(map(user_login => {
      if (user_login && user_login['data']) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('loggedinUser', JSON.stringify(user_login['data']));
      }
      return user_login;
    }));
  }

  registerNewUser(data) {
    return this.config.login(`${environment.apiURL}register`, data).pipe(map(user_register => {
      return user_register;
    }));
  }

  forgotPassword(data) {
    return this.config.login(`${environment.apiURL}forgot-password`, data).pipe(map(forgot_password => {
      return forgot_password;
    }));
  }

  recoverPassword(data) {
    return this.config.login(`${environment.apiURL}recover-password`, data).pipe(map(recover_password => {
      return recover_password;
    }));
  }

  demoData() {
    return this.config.demo(`${environment.apiURL}install`).pipe(map(data => {
      return data;
    }));
  }

  frontAuthentication(data) {
    return this.config.login(`${environment.apiURL}frontLogin`, data).pipe(map(user_login => {
      // if (user_login && user_login['data']) {
      //   // store user details and jwt token in local storage to keep user logged in between page refreshes
      //   localStorage.setItem('loggedinUser', JSON.stringify(user_login['data']));
      // }
      return user_login;
    }));
  }

  accountActivation(data){
    var activationToken = {
      token: data
    }
    return this.http.post<any>(`${environment.apiURL}activation`, activationToken)
    .pipe(map(response => {
        console.log("response of data :", response);
        return response;
    }));
  }
}