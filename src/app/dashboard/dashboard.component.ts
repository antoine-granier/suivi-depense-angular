import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { GroupService } from '../services/group.service';
import { Group } from '../models/group';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  groups: Group[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupService.getGroups().subscribe((data) => (this.groups = data));
  }
}
