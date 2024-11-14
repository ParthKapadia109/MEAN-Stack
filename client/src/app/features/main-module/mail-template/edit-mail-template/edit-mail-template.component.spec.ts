import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMailTemplateComponent } from './edit-mail-template.component';

describe('EditMailTemplateComponent', () => {
  let component: EditMailTemplateComponent;
  let fixture: ComponentFixture<EditMailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
