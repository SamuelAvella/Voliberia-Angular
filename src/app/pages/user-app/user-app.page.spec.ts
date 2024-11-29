import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAppPage } from './user-app.page';

describe('UserAppPage', () => {
  let component: UserAppPage;
  let fixture: ComponentFixture<UserAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
