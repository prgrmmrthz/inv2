import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesReportsComponent } from './boxes-reports.component';

describe('BoxesReportsComponent', () => {
  let component: BoxesReportsComponent;
  let fixture: ComponentFixture<BoxesReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxesReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
