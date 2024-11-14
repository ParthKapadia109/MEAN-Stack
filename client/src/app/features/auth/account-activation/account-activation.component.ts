import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit {

  token : any;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private  authService : AuthService) { }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
    if(!this.token && this.token == undefined){
      alert('Something happend wrong. Please try again after sometime.');
      return;
    }
    this.authService.accountActivation(this.token).pipe(first()).subscribe(data => {
      if(data['response'] == true){
        setTimeout(() => {
          this.route.navigate(['/'])
        }, 3000);
        alert(data['message']);
      }else{
        alert(data['message']);
        setTimeout(() => {
          this.route.navigate(['/'])
        }, 3000);
      }
    }, error => {
      alert(error);
    });
  }

}
