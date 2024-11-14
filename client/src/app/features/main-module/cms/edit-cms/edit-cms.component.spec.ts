import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCmsComponent } from './edit-cms.component';

describe('EditCmsComponent', () => {
  let component: EditCmsComponent;
  let fixture: ComponentFixture<EditCmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
