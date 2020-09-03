import { NgModule } from '@angular/core';
import { AlertComponent } from './modals/alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner/loading-spinner.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { OrderListModule } from 'primeng/orderlist';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    InputTextModule,
    ButtonModule,
    MenubarModule,
    DataViewModule,
    DropdownModule,
    ListboxModule,
    OrderListModule,
    MessagesModule,
    MessageModule,
    DialogModule
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    InputTextModule,
    ButtonModule,
    MenubarModule,
    DataViewModule,
    DropdownModule,
    ListboxModule,
    OrderListModule,
    MessagesModule,
    MessageModule,
    DialogModule
  ]
})
export class SharedModule { }
