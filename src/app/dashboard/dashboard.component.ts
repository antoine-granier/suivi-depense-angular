import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Group } from '../models/group';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  groups: Group[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.getGroups().subscribe((data) => (this.groups = data));
  }
}
