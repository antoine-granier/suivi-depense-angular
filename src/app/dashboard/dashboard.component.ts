import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { ExpenseService } from '../services/expense.service';
import { Group } from '../models/group';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  groups: Group[] = [];

  constructor(private expenseService: ExpenseService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    // Fetch all groups
    this.expenseService.getGroups().subscribe((data) => {
      this.groups = data;
    });
  }

  /**
   * Navigate to the details page of a group.
   * @param groupId ID of the group to view details.
   */
  onGroupDetails(groupId: number): void {
    this.router.navigate(['/group', groupId]);
  }
}
