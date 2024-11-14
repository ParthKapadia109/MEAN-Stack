import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommandService } from './command.service';

@Injectable({
  providedIn: 'root'
})
export class MailTemplateService {

  constructor(
    private config : CommandService
  ) { }

  getMailTemplate() {
    return this.config.get(`${environment.apiURL}viewMailTemplate`).pipe(map(mail => {
      return mail;
    }));
  }

  addMailTemplate(data) {
    return this.config.post(`${environment.apiURL}addMailTemplate`, data).pipe(map(mail => {
      return mail;
    }));
  }

  findMailDetail(slug, id) {
    return this.config.get(`${environment.apiURL}findMailDetails/${slug}/${id}`).pipe(map(mail => {
      return mail;
    }));
  }

  updateMailDetail(id, data) {
    return this.config.put(`${environment.apiURL}updateMailDetail/${id}`, data).pipe(map(mail => {
      return mail;
    }));
  }

  deleteMailDetail(id) {
    return this.config.delete(`${environment.apiURL}deleteMailDetail/${id}`).pipe(map(mail => {
      return mail;
    }));
  }

  changeStatus(id, data) {
    return this.config.put(`${environment.apiURL}changeStatusMail/${id}`, data).pipe(map(mail => {
      return mail;
    }));
  }
}
