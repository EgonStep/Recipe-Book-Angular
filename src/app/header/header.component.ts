import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { DataStorageService } from '../shared/services/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  selector: 'app-header'
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() menuClick = new EventEmitter<string>();

  private userSub: Subscription;

  isAuthenticated = false;

  items: MenuItem[] = [
    {
      label: 'Recipes',
      routerLink: ['/recipes'],
      routerLinkActiveOptions: 'active',
      visible: this.isAuthenticated
    },
    {
      label: 'Shopping List',
      routerLink: ['/shopping-list'],
      routerLinkActiveOptions: 'active'
    },
    {
      label: 'Authenticate',
      routerLink: ['/auth'],
      routerLinkActiveOptions: 'active',
      visible: !this.isAuthenticated
    },
    {
      label: 'Logout',
      routerLink: ['/auth'],
      routerLinkActiveOptions: 'active',
      visible: this.isAuthenticated,
      command: () => this.authService.logout()
    },
    {
      label: 'Manage',
      visible: this.isAuthenticated,
      items: [
        {
          label: 'Save Data',
          command: () => this.dataStorageService.storeRecipes()
        },
        {
          label: 'Fetch Data',
          command: () => this.dataStorageService.fetchRecipes().subscribe()
        }
      ]
    }
  ];

  constructor(
    private readonly dataStorageService: DataStorageService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      // this.isAuthenticated = !user ? false : true;
      this.isAuthenticated = !!user;
      this.showHeadersOnAuth();
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  private showHeadersOnAuth() {
    this.items[0].visible = this.isAuthenticated;
    this.items[2].visible = !this.isAuthenticated;
    this.items[3].visible = this.isAuthenticated;
    this.items[4].visible = this.isAuthenticated;
  }
}
