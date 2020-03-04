import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertBagComponent } from './convert-bag.component';

describe('ConvertBagComponent', () => {
  let component: ConvertBagComponent;
  let fixture: ComponentFixture<ConvertBagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertBagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
