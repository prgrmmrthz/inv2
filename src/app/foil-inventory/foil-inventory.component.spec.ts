import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoilInventoryComponent } from './foil-inventory.component';

describe('FoilInventoryComponent', () => {
  let component: FoilInventoryComponent;
  let fixture: ComponentFixture<FoilInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoilInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoilInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
