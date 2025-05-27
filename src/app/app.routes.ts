import { Routes } from '@angular/router';
import { NavigationLayoutComponent } from './core/layout/navigation-layout/navigation-layout.component';
import { searchHistoryResolver } from './shared/_http/resolvers/search-history.resolver';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'search',
    },
    {
        path: '',
        component: NavigationLayoutComponent,
        children: [
            {
                path: 'search',
                loadComponent: () => import("./modules/search-users/search-users.component").then(c => c.SearchUsersComponent)
            },
            {
                path: 'history',
                loadComponent: () => import("./modules/seach-history/seach-history.component").then(c => c.SeachHistoryComponent),
                resolve: {
                    history: searchHistoryResolver
                }
            }
        ]
    }
];
