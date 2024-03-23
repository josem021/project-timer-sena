import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerMainComponent } from './timer-main.component';

describe('TimerMainComponent', () => {
  let component: TimerMainComponent;
  let fixture: ComponentFixture<TimerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
