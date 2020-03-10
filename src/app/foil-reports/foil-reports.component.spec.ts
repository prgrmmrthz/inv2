import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoilReportsComponent } from './foil-reports.component';

describe('FoilReportsComponent', () => {
  let component: FoilReportsComponent;
  let fixture: ComponentFixture<FoilReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoilReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoilReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
