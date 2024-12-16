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
import { Expense } from '../../models/expense';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit, OnChanges {
  @Input() expense: Expense | null = null; // Expense to edit or null for new
  @Output() submitExpense = new EventEmitter<Expense>(); // Submit event
  @Output() cancel = new EventEmitter<void>(); // Cancel event

  expenseForm!: FormGroup;

  // Dropdown options for categories
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

  /**
   * Initialize the form with default values
   */
  private initializeForm(): void {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      recurring: [false]
    });
  }

  /**
   * Update the form when editing an expense
   */
  private updateForm(expense: Expense): void {
    this.expenseForm.patchValue({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      recurring: expense.recurring
    });
  }

  /**
   * Emit the form value when submitted
   */
  onSubmit(): void {
    if (this.expenseForm.valid) {
      const submittedExpense: Expense = {
        ...this.expenseForm.value,
        id: this.expense ? this.expense.id : undefined, // Preserve ID for editing
        groupId: this.expense ? this.expense.groupId : undefined // Preserve groupId
      };
      this.submitExpense.emit(submittedExpense);
      this.expenseForm.reset();
    }
  }

  /**
   * Emit cancel event and reset the form
   */
  onCancel(): void {
    this.cancel.emit();
    this.expenseForm.reset();
  }
}
