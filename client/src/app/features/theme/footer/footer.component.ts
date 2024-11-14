import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscribable, Subscription } from 'rxjs';
import { ThemeService } from '../../../service/theme.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  accent_color = "text-primary";
  
  subscription : Subscription


  constructor(
    private themeService: ThemeService,
    public translate: TranslateService
  ) { 
    this.subscription = this.themeService.onFooterThemeColor().subscribe(color => {
      const footerColor = color.footer
      if(footerColor != '') {
        this.accent_color = color.footer
     }
    })

    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit(): void {
  }
}
