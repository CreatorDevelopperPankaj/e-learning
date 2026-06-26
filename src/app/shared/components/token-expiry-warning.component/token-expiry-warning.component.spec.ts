import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenExpiryWarningComponent } from './token-expiry-warning.component';

describe('TokenExpiryWarningComponent', () => {
  let component: TokenExpiryWarningComponent;
  let fixture: ComponentFixture<TokenExpiryWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenExpiryWarningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenExpiryWarningComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
