import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
import { Group } from '../../models/group';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';

interface ExpensesByMonth {
  month: string;
  expenses: Expense[];
  total: number;
}

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {
  group!: Group | null;
  expenses: Expense[] = [];
  groupedExpenses: ExpensesByMonth[] = [];
  selectedExpense: Expense | null = null;
  expenseModalVisible: boolean = false;
  isEditing: boolean = false;

  constructor(
    private expenseService: ExpenseService,
    private groupService: GroupService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Écouter les changements d'ID dans l'URL
    this.route.paramMap.subscribe((params) => {
      const groupId = Number(params.get('id'));
      if (groupId) {
        this.loadGroupData(groupId);
      }
    });
  }

  /**
   * Charge les données du groupe et ses dépenses
   */
  loadGroupData(groupId: number): void {
    // Charger les informations du groupe
    this.groupService.getGroupById(groupId).subscribe((group) => {
      this.group = group;
    });

    // Charger les dépenses du groupe
    this.expenseService.getExpensesByGroup(groupId).subscribe((expenses) => {
      this.expenses = expenses;
      this.groupExpensesByMonth();
    });
  }

  /**
   * Regroupe les dépenses par mois et calcule le total.
   */
  groupExpensesByMonth(): void {
    const grouped: { [key: string]: Expense[] } = {};

    this.expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(expense);
    });

    this.groupedExpenses = Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => {
        const expenses = grouped[key];
        return {
          month: this.formatMonth(key),
          expenses,
          total: expenses.reduce((sum, expense) => sum + expense.amount, 0)
        };
      });
  }

  /**
   * Formate le mois pour l'affichage.
   */
  private formatMonth(key: string): string {
    const [year, month] = key.split('-');
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  }

  /**
   * Ouvre la modale pour ajouter ou modifier une dépense.
   */
  openExpenseModal(expense: Expense | null = null): void {
    this.selectedExpense = expense ? { ...expense } : null;
    this.isEditing = !!expense;
    this.expenseModalVisible = true;
  }

  /**
   * Ferme la modale et réinitialise l'état.
   */
  closeExpenseModal(): void {
    this.expenseModalVisible = false;
    this.selectedExpense = null;
    this.isEditing = false;
  }

  /**
   * Supprime une dépense.
   */
  deleteExpense(expenseId: number): void {
    this.expenseService.deleteExpense(expenseId).subscribe(() => {
      this.expenses = this.expenses.filter((expense) => expense.id !== expenseId);
      this.groupExpensesByMonth();
    });
  }

  /**
   * Enregistre une dépense (création ou mise à jour).
   */
  saveExpense(expense: Expense): void {
    if (this.isEditing && this.selectedExpense) {
      this.expenseService
        .updateExpense(this.selectedExpense.id, expense)
        .subscribe((updatedExpense) => {
          this.expenses = this.expenses.map((e) =>
            e.id === updatedExpense.id ? updatedExpense : e
          );
          this.groupExpensesByMonth();
          this.closeExpenseModal();
        });
    } else {
      expense.groupId = Number(this.group!.id);
      this.expenseService.addExpense(expense).subscribe((newExpense) => {
        this.expenses.push(newExpense);
        this.groupExpensesByMonth();
        this.closeExpenseModal();
      });
    }
  }
}
