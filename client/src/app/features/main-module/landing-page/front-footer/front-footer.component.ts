import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CmsService } from 'src/app/service/cms.service';
import { FrontNavBarService } from '../../../../service/front-nav-bar.service';

@Component({
  selector: 'app-front-footer',
  templateUrl: './front-footer.component.html',
  styleUrls: ['./front-footer.component.css']
})
export class FrontFooterComponent implements OnInit {
  
  CMSData : any = []

    
    constructor(private cmsService : CmsService, private frontNavBarService : FrontNavBarService) { }

  ngOnInit(): void {
    this.getAllCMS();
  }

  getAllCMS() {
    this.cmsService.getFrontCMS().pipe(first()).subscribe({
      next : data => {  
        const cmsData : any = data
        if(cmsData.response) {
          this.CMSData = cmsData.data;
        }
      },
      error : error => {
        console.log(error)
      }
    })
  }

  getCMSDetail(slug) {
    this.frontNavBarService.navBarChanging(slug);
  }

}
