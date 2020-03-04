import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseItemsComponent } from './release-items.component';

describe('ReleaseItemsComponent', () => {
  let component: ReleaseItemsComponent;
  let fixture: ComponentFixture<ReleaseItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
