import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../models/group';
import { GroupService } from '../services/group.service';
import { AuthSessionService } from '../services/auth-session.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  groups: Group[] = [];
  selectedGroupId: string | null = null;

  groupModalVisible: boolean = false;
  selectedGroup: Group = { id: "0", name: '', description: '', userId: 0, createdAt: new Date() };
  isEditing: boolean = false;
  sidebarVisible: boolean = true;
  menuItems: MenuItem[] = [];

  constructor(
    private groupService: GroupService,
    private authSessionService: AuthSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authSessionService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadGroups();
    }
  }

  loadGroups(): void {
    const userId = this.authSessionService.getUser().id;
    this.groupService.getGroups(userId).subscribe((data) => {
      this.groups = data;
      this.buildMenuItems();
    });
  }

  /**
   * Construit les éléments de menu dynamiquement.
   */
  buildMenuItems(): void {
    this.menuItems = [
      {
        label: 'Statistiques',
        icon: 'pi pi-chart-bar',
        command: () => this.router.navigate(['/dashboard/stats']),
      },
      ...this.groups.map((group) => ({
        label: group.name,
        icon: 'pi pi-folder',
        command: () => this.onGroupSelected(group.id),
      })),
    ];
  }

  onGroupSelected(groupId: string): void {
    this.selectedGroupId = groupId;
    this.router.navigate(['/dashboard/group', groupId]);
  }

  openGroupModal(): void {
    this.selectedGroup = { id: "0", name: '', description: '', userId: this.authSessionService.getUser().id, createdAt:new Date() };
    this.groupModalVisible = true;
    this.isEditing = false;
  }

  closeGroupModal(): void {
    this.groupModalVisible = false;
  }

  saveGroup(): void {
    this.groupService.getAllGroups().subscribe((groups) => {
      const maxId = groups.reduce((max, group) => Math.max(max, Number(group.id)), 0);
      this.selectedGroup.id = String(maxId + 1);
      this.groupService.addGroup(this.selectedGroup).subscribe(() => {
        this.loadGroups();
        this.closeGroupModal();
      });
    });
  }

  logout(): void {
    this.authSessionService.logout();
    this.router.navigate(['/login']);
  }
  
}
