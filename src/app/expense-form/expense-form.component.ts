import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expense } from '../models/expense';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit, OnChanges {
  @Input() expense: Expense | null = null;
  @Output() submitExpense = new EventEmitter<Expense>();
  @Output() cancel = new EventEmitter<void>();

  expenseForm!: FormGroup;

  categories = [
    { label: 'Logement', value: 'Logement' },
    { label: 'Transport', value: 'Transport' },
    { label: 'Alimentation', value: 'Alimentation' },
    { label: 'Santé', value: 'Santé' },
    { label: 'Loisirs', value: 'Loisirs' },
    { label: 'Autres', value: 'Autres' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expense'] && changes['expense'].currentValue) {
      this.updateForm(changes['expense'].currentValue);
    }
  }

  private initializeForm(): void {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: [null, Validators.required],
      recurring: [false]
    });
  }

  private updateForm(expense: Expense): void {
    this.expenseForm.patchValue({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date),
      recurring: expense.recurring
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const formValue = this.expenseForm.value;
      const submittedExpense: Expense = {
        ...formValue,
        id: this.expense ? this.expense.id : undefined,
        groupId: this.expense ? this.expense.groupId : undefined,
        date: formValue.date.toISOString()
      };
      this.submitExpense.emit(submittedExpense);
      this.expenseForm.reset();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.expenseForm.reset();
  }
}
