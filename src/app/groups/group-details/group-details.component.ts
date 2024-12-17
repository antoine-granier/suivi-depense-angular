import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
import { Group } from '../../models/group';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
  groupedExpenses: ExpensesByMonth[] = []; // Dépenses regroupées par mois
  selectedExpense: Expense | null = null;
  expenseModalVisible: boolean = false;
  isEditing: boolean = false;

  constructor(private expenseService: ExpenseService, private groupService: GroupService, private router:ActivatedRoute) {}

  async ngOnInit() {
    const groupId = Number(this.router.snapshot.paramMap.get('id'));


    this.groupService.getGroupById(groupId).subscribe((group) => {
      this.group = group;
    });

    this.expenseService.getExpensesByGroup(groupId).subscribe((expenses) => {
      this.expenses = expenses;
      this.groupExpensesByMonth(); // Regrouper par mois
    });

    this.expenseService.getExpensesByGroup(groupId).subscribe((expenses) => {
      this.expenses = expenses;
    });
  }
/**
   * Open the modal for creating or editing an expense.
   * @param expense Optional: Expense to edit. If null, the modal will be for creating.
   */
openExpenseModal(expense: Expense | null = null): void {
  this.selectedExpense = expense ? { ...expense } : null;
  this.isEditing = !!expense;
  this.expenseModalVisible = true;
}
  /**
   * Regroupe les dépenses par mois et calcule le total.
   */
  groupExpensesByMonth(): void {
    const grouped: { [key: string]: Expense[] } = {};

    // Grouper les dépenses par année et mois
    this.expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`; // Format: YYYY-MM

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(expense);
    });

    // Convertir en tableau pour l'affichage
    this.groupedExpenses = Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a)) // Tri décroissant par date
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
   * Close the modal and reset the state.
   */
  closeExpenseModal(): void {
    this.expenseModalVisible = false;
    this.selectedExpense = null;
    this.isEditing = false;
  }

  /**
   * Formate le mois pour l'affichage (ex: "2024-06" => "Juin 2024").
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
   * Delete an expense.
   */
    deleteExpense(expenseId: number): void {
      this.expenseService.deleteExpense(expenseId).subscribe(() => {
        this.expenses = this.expenses.filter((expense) => expense.id !== expenseId);
        this.groupExpensesByMonth(); 

      });

    }

   /**
 * Save the expense (create or update).
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
    expense.groupId = this.group!.id; 
    this.expenseService.addExpense(expense).subscribe((newExpense) => {
      this.expenses.push(newExpense);
      this.groupExpensesByMonth(); 
      this.closeExpenseModal();
    });
  }
}

}
