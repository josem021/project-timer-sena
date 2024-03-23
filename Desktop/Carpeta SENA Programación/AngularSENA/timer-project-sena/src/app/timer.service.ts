import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private secondTimer = new BehaviorSubject<number>(0);
  private secondPlay = new BehaviorSubject<boolean>(false);
  private timerSubscription: Subscription | null = null;
  
  secondTimerS: Observable<number> = this.secondTimer.asObservable();
  secondPlayS: Observable<boolean> = this.secondPlay.asObservable();
  selectedTime: number = 0;
  isTimerStarted: boolean = false;
  gameStarted: boolean = false;

  isWorking: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);;
  timerEnded$ = new Subject<void>();
  finalTime: number = 0;

  startTimer() {
    this.isWorking.next(true);
    this.isTimerStarted = true;
    this.gameStarted = true;
    this.finalTime = this.selectedTime;

    if (this.timerSubscription) {
        this.stopTimer();
    }

    this.timerSubscription = timer(0, 1000).pipe (
        map(i => i + 1)
    ).subscribe(s => {
        if (s > this.selectedTime) {
          console.log('Time is up, emitting timerEnded event');
          this.timerEnded$.next();
          this.stopTimer();
        } else {
            this.secondTimer.next(s);
        }
    })
}
  initializeTimer() {
    this.isWorking.next(false);
    this.secondTimer.next(this.selectedTime);
  } 
  play() {
    this.secondPlay.next(true);
    if (!this.isWorking.getValue()){
      this.startTimer();
    }
  }
  pause() {
    this.secondPlay.next(false);
    this.stopTimer();
  }
  stopTimer() {
    this.isWorking.next(false);
    this.isTimerStarted = false;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
  getCurrentTime(): number {
    const currentTime = this.secondTimer.getValue();
    console.log('Current time:', currentTime);
    return currentTime;
  }
}