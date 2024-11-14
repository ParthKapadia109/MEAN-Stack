import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommandService } from './command.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private config : CommandService
  ) { }

  getAllRole() {
    return this.config.get(`${environment.apiURL}role`).pipe(map(role => {
      return role;
    }));
  }

  getRoleDataBySlug(slug) {
    return this.config.get(`${environment.apiURL}find-role/${slug}`).pipe(map(role => {
      return role;
    }));
  }

  updateRoleBySlug(slug, data) {
    return this.config.put(`${environment.apiURL}update-role/${slug}`, data).pipe(map(role => {
      return role;
    }));
  }

  addNewRole(data) {
    return this.config.post(`${environment.apiURL}add-role`, data).pipe(map(role => {
      return role;
    }));
  }

  deleteRoleBySlug(slug) {
    return this.config.delete(`${environment.apiURL}delete-role/${slug}`).pipe(map(role => {
      return role;
    }));
  }

  getSelectRole() {
    return this.config.get(`${environment.apiURL}select-role`).pipe(map(role => {
      return role;
    }));
  }

  changeStatus(data) {
    return this.config.post(`${environment.apiURL}changeStatusRole`, data).pipe(map(role => {
      return role;
    }));
  }
}
