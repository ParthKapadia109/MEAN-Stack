import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import {DashboardService} from '../../../service/dashboard.service';

import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  roleCounter = ""
  userCounter = ""
  moduleCOunter = ""

  rolePermission = false;
  modulePermission = false;
  userPermission = false;

  /**Start pie chart detail Role */
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      // callbacks: {
      //   label: function (tooltipItems, data) {
      //     return data.datasets[0].data[tooltipItems.index]+'';
      //   }
      // }
    },
  };

  pieChartLabels: Label[] = [];

  pieChartData: number[] = [];

  pieChartType: ChartType = 'pie';

  pieChartLegend = true;

  pieChartPlugins = [];

  pieChartColors = [];
  /**End doughnut chart detail Role */

  /**Start doughnut chart detail Role */
  
  allDoughnut : any = [];
  months : any = [];
  selectedMonth : FormGroup;

  doughnutChartLabels: Label[] = [];
  
  doughnutChartData: MultiDataSet = [];
  
  doughnutChartType: ChartType = 'doughnut';
  
  doughnutChartColors = [];

  /**End pie chart detail Role */


  /**Start bar chart details */

  years : any = [];
  selectedYear : FormGroup;
  allYearBarData : any = [];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  barChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [];
  /**End bar chart detail */

  constructor(
    private DashboardService : DashboardService,
    private cookieService: CookieService,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {
    const currentUserData = this.cookieService.get('USER_DATA');
    if(currentUserData) {
      let dataArr : any = JSON.parse(atob(currentUserData));
      const permission = dataArr.permission;

      permission.forEach(element => {
        if(element.module_slug == 'role' && element.title == 'Role') {
          this.rolePermission = true;
        } 
        if(element.module_slug == 'module' && element.title == 'Module') {
          this.modulePermission = true;
        } 
        if(element.module_slug == 'user' && element.title == 'User') {
          this.userPermission = true;
        }
      });
    }
    this.selectedYear = this.fb.group({
      year : ['all']
    });
    this.selectedMonth = this.fb.group({
      month : ['all']
    })
    this.getAllCount();
  }

  get f() {
    return this.selectedYear.controls;
  }

  get f1() {
    return this.selectedMonth.controls;
  }

  getAllCount() {
    this.DashboardService.dashboard().pipe(first()).subscribe({
      next : data => {
        const dashboardData : any = data;
        if(dashboardData.response) {
          this.roleCounter = dashboardData.data.countAll.role
          this.userCounter = dashboardData.data.countAll.user
          this.moduleCOunter = dashboardData.data.countAll.module
          
          this.years = dashboardData.data.yearsList;
          const monthsList = dashboardData.data.monthsList
          monthsList.forEach(ele => {
            const monthName = this.monthName(ele._id.month);
            this.months.push({
              name : monthName,
              value : ele._id.month
            })  
          })

          const pieChart :  any = dashboardData.data.pieChartData
          this.pieData(pieChart);
          this.allDoughnut = pieChart;
          this.doughnutData(this.allDoughnut);
          // const backgroundColor = [];
          // pieChart.forEach(element => {
          //   this.pieChartLabels.push(element._id);
          //   this.pieChartData.push(element.count);
          //   const bgColor = this.getRandomColor();
          //   backgroundColor.push(bgColor);
          // });          
          // this.pieChartColors.push({backgroundColor : backgroundColor});
          
          this.allYearBarData = dashboardData.data.barChartData
          this.barData(this.allYearBarData);
          // const barDataUser = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          // barChart.forEach(element => {
          //   let dataUser = this.barData(element);
          //   barDataUser[dataUser.index] = dataUser.count;
          // });
          // this.barChartData = [{ 
          //     data: barDataUser, 
          //     label: 'Users' 
          // }]

          // this.allDoughnut = dashboardData.data.doughnutData
          // this.doughnutData(this.allDoughnut);
        }
      },
      error : error => {
        console.log(error)
      }
    })
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  barData(element) {
    const barChart : any = element;
    const barDataUser = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    barChart.forEach(element => {
      if(element._id.role != 'supper-admin') {
        let month = element._id.month;
        let count = element.count;
        let index = month - 1;
        const getIndexValue = barDataUser[index];
        barDataUser[index] = getIndexValue + count;
      }
      
    });
    this.barChartData = [{ 
        data: barDataUser, 
        label: 'Total Users' 
    }]
  }

  pieData(element) {
    const pieChart = element;
    const backgroundColor = [];
    pieChart.forEach(element => {
      if(element._id.role != 'supper-admin'){ 
        this.pieChartLabels.push(element._id.role);
        this.pieChartData.push(element.count);
        const bgColor = this.getRandomColor();
        backgroundColor.push(bgColor);
      }
    });          
    this.pieChartColors.push({backgroundColor : backgroundColor});
  }

  yearWiseBarchart() {
    if(this.selectedYear.value.year == 'all') {
      this.barData(this.allYearBarData);
    } else {
      this.DashboardService.barChart(this.selectedYear.value).pipe(first()).subscribe({
        next : data => {
          const dashboardData : any = data;
          if(dashboardData.response) {
            const barChart : any = dashboardData.data.barChartData
            this.barData(barChart);  
          }
        },
        error : error => {
          console.log(error);
        }
      })
    }
  }

  doughnutData(element) {
    const doughnutChart = element;
    const backgroundColor = [];
    this.doughnutChartLabels = []
    this.doughnutChartData = []
    this.doughnutChartColors = []
    doughnutChart.forEach(element => {
      if(element._id.role != 'supper-admin') {
        this.doughnutChartLabels.push(element._id.role);
        this.doughnutChartData.push(element.count);
        const bgColor = this.getRandomColor();
        backgroundColor.push(bgColor);
      }
    });
    this.doughnutChartColors.push({backgroundColor : backgroundColor});
  }

  monthWiseDoughnutChart(){
    if(this.selectedMonth.value.month == 'all') {
      this.doughnutData(this.allDoughnut);
    } else {
      this.DashboardService.doughnutChart(this.selectedMonth.value).pipe(first()).subscribe({
        next : data => {
          const dashboardData : any = data;
          if(dashboardData.response) {
            const doughnutChart : any = dashboardData.data.doughnutChart
            this.doughnutData(doughnutChart);  
          }
        },
        error : error => {
          console.log(error);
        }
      })
    }
  }

  monthName(month) {
    if(month === 1) {
      return 'January'
    } 
    if(month === 2) {
      return 'February'
    } 
    if(month === 3) {
      return 'March'
    } 
    if(month === 4) {
      return 'April'
    } 
    if(month === 5) {
      return 'May'
    } 
    if(month === 6) {
      return 'June'
    } 
    if(month === 7) {
      return 'July'
    } 
    if(month === 8) {
      return 'August'
    } 
    if(month === 9) {
      return 'September'
    } 
    if(month === 10) {
      return 'October'
    } 
    if(month === 11) {
      return 'November'
    } 
    if(month === 12) {
      return 'December'
    } 
  }

}
