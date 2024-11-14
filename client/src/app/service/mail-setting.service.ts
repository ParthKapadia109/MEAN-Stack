import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommandService } from './command.service';

@Injectable({
  providedIn: 'root'
})
export class MailSettingService {

  constructor(
    private config : CommandService
  ) { }

  getMailConfiguration() {
    return this.config.get(`${environment.apiURL}getMailConfiguration`).pipe(map(mail => {
      return mail;
    }));
  }

  mailConfiguration(data) {
    return this.config.post(`${environment.apiURL}updateMailConfiguration`, data).pipe(map(mail => {
      return mail;
    }));
  }

  testMailConfiguration() {
    return this.config.get(`${environment.apiURL}testMailConfiguration`).pipe(map(mail => {
      return mail;
    }));
  }
}
