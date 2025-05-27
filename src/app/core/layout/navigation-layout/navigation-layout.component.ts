import { CommonModule, } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { LabelComponent } from "../../../shared/ui-elements/label/label.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation-layout',
  imports: [
    MatToolbarModule,
    MatTabsModule,
    RouterModule,
    CommonModule,
    LabelComponent
],
  templateUrl: './navigation-layout.component.html',
  styleUrl: './navigation-layout.component.scss'
})
export class NavigationLayoutComponent implements OnDestroy {
  links = [
    { label: "Home", route: 'search'},
    { label: "History", route: 'history'},
  ];
  activeLink = this.links[0].route;

  // injectors
  private router = inject(Router);

  // subscription
  routerSubs: Subscription;

  // lifecycle events
  constructor() {
    this.routerSubs = this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationEnd:
          // Turn off Page Loading
          const urls = this.router.url.split("?")[0].split("/").filter(Boolean);
          if(urls.length > 0) {
            // get first level route url
            this.activeLink = urls[0] 
          }
          break;
        default:
          break;
      }
    })
  }

  ngOnDestroy(): void {
    this.routerSubs.unsubscribe();
  }
}
