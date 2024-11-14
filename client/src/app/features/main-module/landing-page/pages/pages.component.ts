import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { CmsService } from 'src/app/service/cms.service';
import { FrontNavBarService } from '../../../../service/front-nav-bar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  CMSData : any = []
  CMSDetails : any = []
  CMS_slug = ""
  
  subscription : Subscription

  constructor(
    private cmsService : CmsService,
    private actRoute : ActivatedRoute,
    private FrontNavBarService: FrontNavBarService,
  ) { 
    this.subscription = this.FrontNavBarService.onChangeNavBar().subscribe(slugName => {
      const slug = slugName
      this.getCMSDetail(slug);
    })
  }

  ngOnInit(): void {
    this.getAllCMS()
    this.CMS_slug = this.actRoute.snapshot.paramMap.get('slug');
    this.getCMSDetail(this.CMS_slug);
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
    this.CMS_slug = slug;
    this.cmsService.getFrontCmsDetail(slug).pipe(first()).subscribe({
      next : data => {
        const cmsDetail : any = data
        if(cmsDetail.response) {
           this.CMSDetails = cmsDetail.data
        } 
      },
      error : error => {
        console.log(error)
      }
    })
  }

}
