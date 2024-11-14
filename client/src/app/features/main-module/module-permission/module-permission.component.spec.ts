import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulePermissionComponent } from './module-permission.component';

describe('ModulePermissionComponent', () => {
  let component: ModulePermissionComponent;
  let fixture: ComponentFixture<ModulePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
