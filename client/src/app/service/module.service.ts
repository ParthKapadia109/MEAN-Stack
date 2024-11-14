import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(
    private config : CommandService
  ) { }

  getAllModule() {
    return this.config.get(`${environment.apiURL}view-module`).pipe(map(module => {
      return module;
    }));
  }

  editModule(slug) {
    return this.config.get(`${environment.apiURL}find-module/${slug}`).pipe(map(module => {
      return module;
    }));
  }

  addModule(data) {
    return this.config.post(`${environment.apiURL}add-module`, data).pipe(map(module => {
      return module;
    }))
  }

  updateModule(slug, data) {
    return this.config.put(`${environment.apiURL}update-module/${slug}`, data).pipe(map(module => {
      return module;
    }));
  }

  rolePermission(slug) {
    return this.config.get(`${environment.apiURL}view_permission/${slug}`).pipe(map(module => {
      return module;
    }));
  }

  addPermission(data) {
    return this.config.post(`${environment.apiURL}add-permission`, data).pipe(map(module => {
      return module;
    }))
  }

  deleteModule(data) {
    return this.config.delete(`${environment.apiURL}delete-module/${data}`).pipe(map(module => {
      return module;
    }))
  }
}
