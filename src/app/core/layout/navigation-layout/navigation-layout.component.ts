import { CommonModule, } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-layout',
  imports: [
    MatToolbarModule,
    MatTabsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './navigation-layout.component.html',
  styleUrl: './navigation-layout.component.scss'
})
export class NavigationLayoutComponent {
  links = [
    { label: "Home", route: 'search'},
    { label: "History", route: 'history'},
  ];
  activeLink = this.links[0].route;

  // injectors
  private router = inject(Router);

  // lifecycle events
  constructor() {
    const urls = this.router.url.split("/").filter(Boolean);
    if(urls.length > 0) {
      // get first level route url
      this.activeLink = urls[0] 
    }
  }
}
