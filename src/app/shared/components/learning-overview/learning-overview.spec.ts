import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningOverview } from './learning-overview';

describe('LearningOverview', () => {
  let component: LearningOverview;
  let fixture: ComponentFixture<LearningOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
