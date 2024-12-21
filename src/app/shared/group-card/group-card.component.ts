import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Group } from '../../models/group';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss']
})
export class GroupCardComponent {
  @Input() group!: Group;
  @Output() details = new EventEmitter<string>();

  viewDetails(): void {
    this.details.emit(this.group.id); 
  }
}
