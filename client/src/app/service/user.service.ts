import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommandService } from './command.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private config : CommandService
  ) { }

  getAllUser() {
    return this.config.get(`${environment.apiURL}view-user`).pipe(map(user => {
      return user;
    }));
  }

  addNewUser(data) {
    return this.config.post(`${environment.apiURL}add-user`, data).pipe(map(user => {
      return user;
    }));
  }

  deleteUser(slug) {
    return this.config.delete(`${environment.apiURL}delete-user/${slug}`).pipe(map(user => {
      return user;
    }));
  }

  getUserDetail(slug) {
    return this.config.get(`${environment.apiURL}find-user/${slug}`).pipe(map(user => {
      return user;
    }));
  }

  editUser(id, data) {
    return this.config.put(`${environment.apiURL}update-user/${id}`, data).pipe(map(user => {
      return user;
    }));
  }

  addPermission(data) {
    return this.config.post(`${environment.apiURL}user-permission`, data).pipe(map(user => {
      return user;
    }));
  }

  toggleUpdate(data) {
    return this.config.post(`${environment.apiURL}toggle-update`, data).pipe(map(user => {
      return user;
    }));
  }

  customThemeAPI(data) {
    return this.config.post(`${environment.apiURL}custom-theme`, data).pipe(map(theme => {
      return theme;
    }));
  }

  frontProfileEdit(id, data) {
    return this.config.putFront(`${environment.apiURL}update-user/${id}`, data).pipe(map(user => {
      return user;
    }));
  }

  changeStatus(data) {
    return this.config.post(`${environment.apiURL}changeStatusUser`, data).pipe(map(theme => {
      return theme;
    }));
  }
}
