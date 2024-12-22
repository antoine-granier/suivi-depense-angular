import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GroupService } from '../services/group.service';
import { ExpenseService } from '../services/expense.service';
import { forkJoin } from 'rxjs';
import { Group } from '../models/group';
import { Expense } from '../models/expense';
import { AuthSessionService } from '../services/auth-session.service';

@Component({
  selector: 'app-statistic-toggle',
  templateUrl: './statistic-toggle.component.html',
  styleUrls: ['./statistic-toggle.component.scss'],
})
export class StatisticToggleComponent implements OnInit, OnChanges {
  @Input() id?: string;

  showBarChart = true;
  barChartData: any;
  pieChartData: any;

  groups: Group[] = [];
  expensesByGroup: { [groupId: string]: Expense[] } = {};
  isLoading = true;

  constructor(
    private groupService: GroupService,
    private expenseService: ExpenseService,
    private authSessionService: AuthSessionService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
     this.refreshData()
    }
  }

  loadData() {
    const userId = this.authSessionService.getUser().id;
    this.isLoading = true;

    if (this.id) {
      this.groupService.getGroupById(Number(this.id)).subscribe({
        next: (group: Group) => {
          this.groups = [group];
          this.loadExpensesForGroups(this.groups);
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.groupService.getGroups(userId).subscribe({
        next: (groups: Group[]) => {
          this.groups = groups;
          this.loadExpensesForGroups(this.groups);
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  loadExpensesForGroups(groups: Group[]) {
    const expenseRequests = groups.map((group) =>
      this.expenseService.getExpensesByGroup(Number(group.id))
    );

    forkJoin(expenseRequests).subscribe({
      next: (expensesArray: Expense[][]) => {
        expensesArray.forEach((expenses, index) => {
          this.expensesByGroup[this.groups[index].id] = expenses;
        });
        this.setupCharts();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  setupCharts() {
    this.setupBarChart();
    this.setupPieChart();
  }

  setupBarChart() {
    const groupTotals = this.groups.map((group) => {
      const total = (this.expensesByGroup[group.id] || []).reduce(
        (sum: number, expense: Expense) => sum + expense.amount,
        0
      );
      return { groupName: group.name, total };
    });

    this.barChartData = {
      labels: groupTotals.map((g) => g.groupName),
      datasets: [
        {
          label: 'Dépenses par groupe',
          backgroundColor: '#42A5F5',
          data: groupTotals.map((g) => g.total),
        },
      ],
    };
  }

  setupPieChart() {
    const categoryTotals: { [key: string]: number } = {};

    Object.values(this.expensesByGroup).forEach((expenses) => {
      expenses.forEach((expense) => {
        categoryTotals[expense.category] =
          (categoryTotals[expense.category] || 0) + expense.amount;
      });
    });

    this.pieChartData = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#81C784'],
        },
      ],
    };
  }

  toggleChart() {
    this.showBarChart = !this.showBarChart;
  }

  refreshData(): void {
    this.expensesByGroup = {};
    this.loadData();
  }
}
