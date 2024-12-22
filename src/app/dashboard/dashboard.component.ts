import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../models/group';
import { GroupService } from '../services/group.service';
import { AuthSessionService } from '../services/auth-session.service';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  groups: Group[] = [];
  selectedGroupId: string | null = null;

  groupModalVisible: boolean = false;
  groupForm: FormGroup;
  isEditing: boolean = false;
  menuItems: MenuItem[] = [];

  constructor(
    private groupService: GroupService,
    private authSessionService: AuthSessionService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.groupForm = this.fb.group({
      id: ["0"],
      name: ["", Validators.required],
      description: [""],
      userId: [0],
      createdAt: [new Date()]
    });
  }

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

  buildMenuItems(): void {
    const actionItems: MenuItem[] = [
      {
        label: 'Statistiques',
        icon: 'pi pi-chart-bar',
        command: () => this.router.navigate(['/dashboard/stats']),
      },
      {
        label: 'Ajouter un groupe',
        icon: 'pi pi-plus',
        command: () => this.openGroupModal(),
      },
    ];

    const groupItems: MenuItem[] = this.groups.map((group) => ({
      label: group.name,
      icon: 'pi pi-folder',
      command: () => this.onGroupSelected(group.id),
    }));

    this.menuItems = [
      {
        label: 'Actions',
        items: actionItems,
      },
      {
        label: 'Groupes',
        items: groupItems,
      },
    ];
  }

  onGroupSelected(groupId: string): void {
    this.selectedGroupId = groupId;
    this.router.navigate(['/dashboard/group', groupId]);
  }

  openGroupModal(): void {
    this.groupForm.reset({
      id: "0",
      name: "",
      description: "",
      userId: this.authSessionService.getUser().id,
      createdAt: new Date()
    });
    this.groupModalVisible = true;
    this.isEditing = false;
  }

  closeGroupModal(): void {
    this.groupModalVisible = false;
  }

  saveGroup(): void {
    if (this.groupForm.invalid) {
      return;
    }

    const newGroup: Group = this.groupForm.value;

    this.groupService.getAllGroups().subscribe((groups) => {
      const maxId = groups.reduce((max, group) => Math.max(max, Number(group.id)), 0);
      newGroup.id = String(maxId + 1);
      this.groupService.addGroup(newGroup).subscribe(() => {
        this.loadGroups();
        this.closeGroupModal();
      });
    });
  }

  logout(): void {
    this.authSessionService.logout();
    this.router.navigate(['/login']);
  }

  getUsername(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        return user?.name || null;
      } catch (error) {
        console.error('Erreur de parsing JSON:', error);
        return null;
      }
    }
    return null;
  }
}