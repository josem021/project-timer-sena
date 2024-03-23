import { ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeamNamesService } from '../../team-names.service';
import { TimerService } from '../../timer.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ScoredComponent } from '../scored/scored.component';
import { NgZone } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value - minutes * 60;
    return ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
  }
}

@Component({
  selector: 'app-timer-main',
  standalone: true,
  imports: [FormsModule, CommonModule, ScoredComponent],
  templateUrl: './timer-main.component.html',
  styleUrls: ['./timer-main.component.css'],
  providers: [FormatTimePipe]
})
export class TimerMainComponent implements OnInit {
  teamOneName = '';
  teamTwoName = '';
  isFormVisible: boolean = true;
  isCloseButtonVisible: boolean = true;
  isInputVisible: boolean = true;
  selectedTime: number = 60;
  secondsS: Observable<number> = this.timerService.secondTimerS;
  formatTimePipe = new FormatTimePipe();
  isCustomTime: boolean = false;
  customTimeInput: string = "";
  customTime: string = "";
  customOption: string = "";

  teamOneScore: number = 0;
  teamTwoScore: number = 0;
  isWinnerModalVisible: boolean = false;
  winnerTeamName: string = '';
  
  formatCustomTime(time: string): any {
    const timeParts =time.split(':');
    if (timeParts.length !== 2) {
      return null;
    }

    const minutes = Number(timeParts[0]);
    const seconds = Number(timeParts[1]);

    if (isNaN(minutes) || isNaN(seconds)) {
      return null
    }

    return minutes * 60 + seconds;
  }
  constructor(private ngZone: NgZone, private teamNamesService: TeamNamesService, public timerService: TimerService, private changeDetector: ChangeDetectorRef) {
    this.onTimeChange({ target: { value: '60' } } as any);
    this.timerService.secondPlayS.subscribe(isPlaying => {
      this.secondsS = this.timerService.secondTimerS;
      if (isPlaying) {
        this.timerService.startTimer();
      } else {
        this.timerService.stopTimer();
      }
    });
    this.timerService.isWorking.subscribe(isWorking => {
      if (!isWorking && this.timerService.getCurrentTime() === 0 && this.timerService.gameStarted) {
        this.showWinner();
      }
    });
    this.timerService.initializeTimer();
  }
  
  ngOnInit() {
    this.timerService.timerEnded$.subscribe(() => {
      this.ngZone.run(() => {
        console.log('Received timerEnded event, calling showWinner');
        this.showWinner();
      });
    });
  }
  showWinner() {
    console.log('showWinner called. gameStarted:', this.timerService.gameStarted, 'isWorking:', this.timerService.isWorking.getValue(), 'getCurrentTime:', this.timerService.getCurrentTime());
      if (this.teamOneScore > this.teamTwoScore) {
        this.winnerTeamName = this.teamOneName;
        
      } else if (this.teamOneScore < this.teamTwoScore) {
        this.winnerTeamName = this.teamTwoName;
      } else {
        this.winnerTeamName = 'Empate';
      }
      
      if (this.timerService.gameStarted && this.timerService.getCurrentTime() === this.timerService.finalTime) {
        this.isWinnerModalVisible = true;
        this.changeDetector.markForCheck();
        console.log("Heroico de papel")
      }
  }
  gameOver() {
    this.isWinnerModalVisible = true;
  }
  resetGame() {
    this.teamOneScore = 0;
    this.teamTwoScore = 0;
    this.isFormVisible = true;
    this.isWinnerModalVisible = false;
    this.winnerTeamName = '';
    this.timerService.gameStarted = false;
  }

  onSubmit(formValues: {teamOneName: string, teamTwoName: string}) {
    this.teamOneName = formValues.teamOneName;
    this.teamTwoName = formValues.teamTwoName;
    this.isFormVisible = false;

    this.teamNamesService.setTeamOneName(this.teamOneName)
    this.teamNamesService.setTeamTwoName(this.teamTwoName)

    
  }

  onTimeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTime = Number(selectElement.value);
    this.timerService.selectedTime = this.selectedTime;

    if (this.selectedTime === 0) {
      this.isCustomTime = true;
      this.isInputVisible = true;
      alert("Usar este formato: 00:00");
    } else {
      this.isCustomTime = false;
      this.isInputVisible = false;
    }
  }
  onPlayClicked() {
    console.log('Received playClicked event');
    this.timerService.play();
    this.timerService.startTimer();
  }

  get formattedTime(): string {
    let currentTime = this.timerService.getCurrentTime();
    return this.formatTimePipe.transform(currentTime);
  }
  closeModal() {
    this.isCustomTime = false;
    const formattedTime = this.formatCustomTime(this.customTimeInput);
    if (formattedTime !== null) {
      this.selectedTime = formattedTime;
      this.timerService.selectedTime = this.selectedTime;
      this.customOption = this.customTimeInput;
    } else {
      alert("Error formato tiempo")
    }
    this.isCloseButtonVisible = false;
  }

  teamOneScores() {
    this.teamOneScore += 1;
  }
  teamTwoScores() {
    this.teamTwoScore += 1;
  }
  getScoreColor(teamOneScore: number, teamTwoScore: number): string {
    if (teamOneScore > teamTwoScore) {
      return 'green';
    } else if (teamOneScore < teamTwoScore) {
      return 'red';
    } else {
      return 'white';
    }
  }
  endGame() {
    this.isWinnerModalVisible = true;
  }
}