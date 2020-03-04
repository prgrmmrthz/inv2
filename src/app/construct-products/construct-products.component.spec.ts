import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructProductsComponent } from './construct-products.component';

describe('ConstructProductsComponent', () => {
  let component: ConstructProductsComponent;
  let fixture: ComponentFixture<ConstructProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
