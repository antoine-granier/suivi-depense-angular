import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticToggleComponent } from './statistic-toggle.component';

describe('StatisticToggleComponent', () => {
  let component: StatisticToggleComponent;
  let fixture: ComponentFixture<StatisticToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticToggleComponent]
    });
    fixture = TestBed.createComponent(StatisticToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
