import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Expense } from '../models/expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000';
  private expensesUrl = `${this.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.expensesUrl);
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.expensesUrl, expense);
  }

  updateExpense(id: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.expensesUrl}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.expensesUrl}/${id}`);
  }

  getExpensesByGroup(groupId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.expensesUrl}?groupId=${groupId}`);
  }

  getTotalExpenseByGroup(groupId: number): Observable<number> {
    return this.getExpensesByGroup(groupId).pipe(
      map((expenses) =>
        expenses.reduce((total, expense) => total + expense.amount, 0)
      )
    );
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.expensesUrl}/${id}`);
  }

  getRecurringExpensesByGroup(groupId: number): Observable<Expense[]> {
    return this.getExpensesByGroup(groupId).pipe(
      map((expenses) => expenses.filter((expense) => expense.recurring))
    );
  }

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
