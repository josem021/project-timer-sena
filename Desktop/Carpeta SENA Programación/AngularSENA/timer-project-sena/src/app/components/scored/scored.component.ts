import { Component, EventEmitter, Output } from '@angular/core';
import { TeamNamesService } from '../../team-names.service';
import { TimerService } from '../../timer.service';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-scored',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scored.component.html',
  styleUrl: './scored.component.css'
})
export class ScoredComponent {
  teamOneName: String = "";
  teamTwoName: String = "";
  isGameStarted: boolean = false;
  isCountdownVisible: boolean = false;
  countdownValue: number = 3;

  isWorking: boolean = false;
  private subscription!: Subscription;
  @Output() playClicked = new EventEmitter<void>();
  @Output() teamOneScores = new EventEmitter<void>();
  @Output() teamTwoScores = new EventEmitter<void>();
  @Output() resetGame = new EventEmitter<void>();
  @Output() gameOver = new EventEmitter<void>();

  onTeamOneScores() {
    this.teamOneScores.emit();
  }
  onTeamTwoScores() {
    this.teamTwoScores.emit();
  }
  onPlayClick() {
    this.isGameStarted = true;
    this.isCountdownVisible = true;
    const countdownInterval = setInterval(() => {
      if (this.countdownValue > 1) {
        this.countdownValue--;
      } else {
        clearInterval(countdownInterval);
        this.isCountdownVisible = false;
        this.countdownValue = 3;
        this.playClicked.emit();
        this.isWorking = true;
        this.changeDetector.detectChanges();
      }
    }, 1000);
  }
  constructor(private teamNamesService: TeamNamesService, public timerService: TimerService, private changeDetector: ChangeDetectorRef) {
    this.timerService.isWorking.subscribe(isWorking => {
      this.isWorking = isWorking;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  ngOnInit() {
    this.teamNamesService.teamOneName$.subscribe(name => this.teamOneName = name);
    this.teamNamesService.teamTwoName$.subscribe(name => this.teamTwoName = name);
    this.timerService.isWorking.subscribe(isWorking => {
      this.isWorking = isWorking;
      if (!isWorking) {
        this.gameOver.emit();
      }
      this.changeDetector.detectChanges();
    });
  }

  
  
}