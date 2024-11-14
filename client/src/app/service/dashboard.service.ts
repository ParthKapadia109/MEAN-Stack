import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private config : CommandService
  ) { }

  dashboard() {
    return this.config.get(`${environment.apiURL}dashboard`).pipe(map(dashboard => {
      return dashboard;
    }));
  }

  barChart(data) {
    return this.config.post(`${environment.apiURL}dashboard/barChart`, data).pipe(map(dashboard => {
      return dashboard;
    }));
  }

  doughnutChart(data) {
    return this.config.post(`${environment.apiURL}dashboard/doughnutChart`, data).pipe(map(dashboard => {
      return dashboard;
    }));
  }
}
