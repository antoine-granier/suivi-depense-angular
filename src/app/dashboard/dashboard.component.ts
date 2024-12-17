import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { Group } from '../models/group';
import { AuthSessionService } from '../services/auth-session.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'div.app-dashboard.w-screen.h-screen.flex.gap-2',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  groups: Group[] = [];

  constructor(private groupService: GroupService, private router: Router, private authSessionService: AuthSessionService) {} // Inject Router

  ngOnInit(): void {
    // Fetch all groups
    const userId = this.authSessionService.getUser().id
    this.groupService.getGroups(userId).subscribe((data) => {
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
