import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
import { Group } from '../../models/group';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {
  group!: Group | null; // Current group details
  expenses: Expense[] = []; // List of expenses
  selectedExpense: Expense | null = null; // Expense to edit or create
  expenseModalVisible: boolean = false; // Controls the visibility of the modal
  isEditing: boolean = false; // Whether the modal is in editing mode

  constructor(private expenseService: ExpenseService, private groupService: GroupService, private router:ActivatedRoute) {}

  async ngOnInit() {
    const groupId = Number(this.router.snapshot.paramMap.get('id'));


    // Fetch group details
    this.groupService.getGroupById(groupId).subscribe((group) => {
      this.group = group;
    });

    // Fetch expenses for the group
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
   * Save the expense (create or update).
   */
  saveExpense(expense: Expense): void {
    if (this.isEditing && this.selectedExpense) {
      // Update existing expense
      this.expenseService
        .updateExpense(this.selectedExpense.id, expense)
        .subscribe((updatedExpense) => {
          this.expenses = this.expenses.map((e) =>
            e.id === updatedExpense.id ? updatedExpense : e
          );
          this.closeExpenseModal();
        });
    } else {
      // Create new expense
      expense.groupId = this.group!.id;
      this.expenseService.addExpense(expense).subscribe((newExpense) => {
        this.expenses.push(newExpense);
        this.closeExpenseModal();
      });
    }
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
   * Delete an expense.
   */
  deleteExpense(expenseId: number): void {
    this.expenseService.deleteExpense(expenseId).subscribe(() => {
      this.expenses = this.expenses.filter((expense) => expense.id !== expenseId);
    });
  }

  /**
   * Calculate the total amount of all expenses.
   */
  getTotalExpenses(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }
}
