import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMailTemplateComponent } from './add-mail-template.component';

describe('AddMailTemplateComponent', () => {
  let component: AddMailTemplateComponent;
  let fixture: ComponentFixture<AddMailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
