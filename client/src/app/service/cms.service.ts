import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  constructor(
    private config : CommandService 
  ) { }

  addCMS(data) {
    return this.config.post(`${environment.apiURL}add-cms-details`, data).pipe(map(cms => {
      return cms;
    }));
  }

  getCMS() {
    return this.config.get(`${environment.apiURL}get-cms`).pipe(map(cms => {
      return cms;
    }));
  }

  deleteCMS(slug, _id) {
    return this.config.delete(`${environment.apiURL}delete-cms/${slug}/${_id}`).pipe(map(cms => {
      return cms;
    }));
  }

  getEditCmsDetails(slug, _id) {
    return this.config.get(`${environment.apiURL}edit-cms/${slug}/${_id}`).pipe(map(cms => {
      return cms;
    }));
  }

  UpdateCmsDetails(_id, data) {
    return this.config.put(`${environment.apiURL}update-cms/${_id}`, data).pipe(map(cms => {
      return cms;
    }));
  }


  getFrontCMS() {
    return this.config.demo(`${environment.apiURL}get-front-cms`).pipe(map(cms => {
      return cms;
    }));
  }

  getFrontCmsDetail(slug) {
    return this.config.demo(`${environment.apiURL}get-cms-detail/${slug}`).pipe(map(cms => {
      return cms;
    }));
  }
  changeStatus(data) {
    return this.config.post(`${environment.apiURL}changeStatusCMS`, data).pipe(map(role => {
      return role;
    }));
  }
}
