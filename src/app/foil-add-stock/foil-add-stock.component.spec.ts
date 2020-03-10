import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoilAddStockComponent } from './foil-add-stock.component';

describe('FoilAddStockComponent', () => {
  let component: FoilAddStockComponent;
  let fixture: ComponentFixture<FoilAddStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoilAddStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoilAddStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
