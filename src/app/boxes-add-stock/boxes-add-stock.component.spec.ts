import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesAddStockComponent } from './boxes-add-stock.component';

describe('BoxesAddStockComponent', () => {
  let component: BoxesAddStockComponent;
  let fixture: ComponentFixture<BoxesAddStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxesAddStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesAddStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
