import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../models/group';
import { AuthSessionService } from '../services/auth-session.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'div.app-dashboard.w-screen.h-screen.flex.gap-2',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  groups: Group[] = [];
  selectedGroup: Group | null = null; // Utilisé pour modifier un groupe
  groupModalVisible: boolean = false; // Contrôle la visibilité de la modale
  isEditing: boolean = false;

  constructor(
    private groupService: GroupService,
    private router: Router,
    private authSessionService: AuthSessionService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    const userId = this.authSessionService.getUser().id;
    this.groupService.getGroups(userId).subscribe((data) => {
      this.groups = data;
    });
  }

  openGroupModal(group: Group | null = null): void {
    this.selectedGroup = group ? { ...group } : { id: 0, name: '', description: '', userId: this.authSessionService.getUser().id, createdAt:new Date() };
    this.isEditing = !!group;
    this.groupModalVisible = true;
  }

  saveGroup(): void {
    if (this.isEditing && this.selectedGroup) {
      // Modifier le groupe existant
      this.groupService.updateGroup(this.selectedGroup.id, this.selectedGroup).subscribe(() => {
        this.loadGroups();
        this.closeGroupModal();
      });
    } else if (this.selectedGroup) {
      // Ajouter un nouveau groupe
      this.groupService.addGroup(this.selectedGroup).subscribe(() => {
        this.loadGroups();
        this.closeGroupModal();
      });
    }
  }

  deleteGroup(groupId: number): void {
    this.groupService.deleteGroup(groupId).subscribe(() => {
      this.groups = this.groups.filter((group) => group.id !== groupId);
    });
  }

  closeGroupModal(): void {
    this.groupModalVisible = false;
    this.selectedGroup = null;
    this.isEditing = false;
  }

  onGroupDetails(groupId: number): void {
    this.router.navigate(['/group', groupId]);
  }
}
