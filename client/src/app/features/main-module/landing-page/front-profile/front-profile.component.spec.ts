import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontProfileComponent } from './front-profile.component';

describe('FrontProfileComponent', () => {
  let component: FrontProfileComponent;
  let fixture: ComponentFixture<FrontProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
