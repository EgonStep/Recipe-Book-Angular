import { Component, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  selector: 'app-header'
})
export class HeaderComponent {

  @Output() menuClick = new EventEmitter<string>();

  items: MenuItem[] = [
    {
      label: 'Recipes',
      routerLink: ['/recipes'],
      routerLinkActiveOptions: 'active'
    },
    {
      label: 'Shopping List',
      routerLink: ['/shopping-list'],
      routerLinkActiveOptions: 'active'
    },
    {
      label: 'Manage',
      items: [
        {
          label: 'Save Data'
        },
        {
          label: 'Fetch Data'
        }
      ]
    }
  ];
}
