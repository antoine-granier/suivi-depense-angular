import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupDetailsComponent } from './groups/group-details/group-details.component';
import { ExpenseFormComponent } from './shared/expense-form/expense-form.component';
import { HighlightDirective } from './directives/highlight.directive';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { PrimeNgModule } from './primeng/primeng.module';
import { SharedModule } from './shared/shared.module';
import { StatisticToggleComponent } from './statistic-toggle/statistic-toggle.component';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    GroupDetailsComponent,
    ExpenseFormComponent,
    HighlightDirective,
    CurrencyFormatPipe,
    StatisticToggleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimeNgModule,
    SharedModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
