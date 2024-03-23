import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TeamNamesService {
  private teamOneNameSource = new BehaviorSubject<string>('');
  private teamTwoNameSource = new BehaviorSubject<string>('');

  teamOneName$ = this.teamOneNameSource.asObservable();
  teamTwoName$ = this.teamTwoNameSource.asObservable();

  setTeamOneName(name: string) {
    this.teamOneNameSource.next(name);
  }
  setTeamTwoName(name: string) {
    this.teamTwoNameSource.next(name);
  }
}
