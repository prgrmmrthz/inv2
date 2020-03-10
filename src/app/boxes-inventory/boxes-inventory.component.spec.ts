import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesInventoryComponent } from './boxes-inventory.component';

describe('BoxesInventoryComponent', () => {
  let component: BoxesInventoryComponent;
  let fixture: ComponentFixture<BoxesInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxesInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
