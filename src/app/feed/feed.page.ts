import { Component, OnInit, ViewChild } from '@angular/core';
import { WoocommerceService } from '../service/woocommerce.service';
import { concat } from 'rxjs/index';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  products: any = [];
  res: any
  page: number = 1;
  maxPage: number;

  constructor(
    public woocommerceService: WoocommerceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.woocommerceService.getProducts(this.page)
      .then(res => { this.res = res });

    // .then(
    //   (res: Object) => {
    //     this.products = (<any>res).body;
    //     this.maxPage = (<any>res).headers.get('X-WP-TotalPages');
    //   },
    //   err => {
    //     console.log(err)
    //   }
    // )
  }

  loadData(event) {
    if (this.page < this.res.headers.get('X-WP-TotalPages')) {
      console.log(event)
      setTimeout(() => {
        this.woocommerceService.getProducts(this.page + 1)
          .then(
            res => {
              const newList = this.products.concat((<any>res).body);
              this.products = newList;
              this.page++;
              event.target.complete();
            },
            err => {
              console.log(err);
            }
          )
      }, 500);
    }
    else {
      event.target.disabled = true;
    }
  }

  viewDetails(productId) {
    this.router.navigate(['/details/' + productId]);
  }

}
