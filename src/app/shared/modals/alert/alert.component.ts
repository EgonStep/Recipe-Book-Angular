import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {


  @Input() header: string;
  @Input() message: string;
  @Input() display: boolean;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
