import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Expense } from '../models/expense';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000';
  private expensesUrl = `${this.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  // -------------- Expense Methods --------------
  /**
   * Fetch all expenses.
   */
  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.expensesUrl);
  }

  /**
   * Add a new expense.
   * @param expense Expense object to add.
   */
  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.expensesUrl, expense);
  }

  /**
   * Update an existing expense.
   * @param id Expense ID to update.
   * @param expense Updated expense data.
   */
  updateExpense(id: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.expensesUrl}/${id}`, expense);
  }

  /**
   * Delete an expense by ID.
   * @param id Expense ID to delete.
   */
  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.expensesUrl}/${id}`);
  }

  /**
   * Get all expenses for a specific group by its ID.
   * @param groupId Group ID to filter expenses.
   */
  getExpensesByGroup(groupId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.expensesUrl}?groupId=${groupId}`);
  }

  /**
   * Get the total amount of expenses for a specific group by its ID.
   * @param groupId Group ID to calculate the total expense amount.
   */
  getTotalExpenseByGroup(groupId: number): Observable<number> {
    return this.getExpensesByGroup(groupId).pipe(
      map((expenses) =>
        expenses.reduce((total, expense) => total + expense.amount, 0)
      )
    );
  }

  /**
   * Fetch a single expense by its ID.
   * @param id Expense ID.
   */
  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.expensesUrl}/${id}`);
  }

  /**
   * Get recurring expenses for a specific group by its ID.
   * @param groupId Group ID to filter recurring expenses.
   */
  getRecurringExpensesByGroup(groupId: number): Observable<Expense[]> {
    return this.getExpensesByGroup(groupId).pipe(
      map((expenses) => expenses.filter((expense) => expense.recurring))
    );
  }

  /**
   * Search expenses by a term within a group.
   * @param groupId Group ID to filter.
   * @param term Search term (e.g., description).
   */
  searchExpenses(groupId: number, term: string): Observable<Expense[]> {
    return this.getExpensesByGroup(groupId).pipe(
      map((expenses) =>
        expenses.filter((expense) =>
          expense.description.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }
}
