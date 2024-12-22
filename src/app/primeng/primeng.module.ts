import { NgModule } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';


@NgModule({
  exports: [
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    DialogModule,
    CheckboxModule,
    DropdownModule,
    DialogModule,
    CardModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    CalendarModule,
    InputNumberModule,
    MenuModule,
    AvatarModule
  ]
})
export class PrimeNgModule {}
