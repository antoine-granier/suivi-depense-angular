import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent {
  @Output() submitExpense = new EventEmitter<any>();
  expenseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      recurring: [false]
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.submitExpense.emit(this.expenseForm.value);
      this.expenseForm.reset();
    }
  }
}
