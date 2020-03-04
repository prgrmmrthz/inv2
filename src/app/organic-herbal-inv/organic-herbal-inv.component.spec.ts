import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganicHerbalInvComponent } from './organic-herbal-inv.component';

describe('OrganicHerbalInvComponent', () => {
  let component: OrganicHerbalInvComponent;
  let fixture: ComponentFixture<OrganicHerbalInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganicHerbalInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganicHerbalInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
