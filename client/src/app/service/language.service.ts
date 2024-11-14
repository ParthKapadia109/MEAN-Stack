import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommandService } from './command.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(
    private config : CommandService
  ) { }

  getAllLanguage(data) {
    return this.config.post(`${environment.apiURL}get_lang`, data).pipe(map(lang => {
      return lang;
    }));
  }

  addSelectedLanguage(data) {
    return this.config.post(`${environment.apiURL}update_lang`, data).pipe(map(language => {
      return language;
    }));
  }

  getLanguage(data) {
    return this.config.post(`${environment.apiURL}get_user_selected_lang`, data).pipe(map(lang => {
      return lang;
    }));
  }
}
