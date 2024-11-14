import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontRegisterComponent } from './front-register.component';

describe('FrontRegisterComponent', () => {
  let component: FrontRegisterComponent;
  let fixture: ComponentFixture<FrontRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
