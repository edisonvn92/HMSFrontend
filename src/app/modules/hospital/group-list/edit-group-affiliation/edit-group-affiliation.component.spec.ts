import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupAffiliationComponent } from './edit-group-affiliation.component';

describe('EditGroupAffiliationComponent', () => {
  let component: EditGroupAffiliationComponent;
  let fixture: ComponentFixture<EditGroupAffiliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditGroupAffiliationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupAffiliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
