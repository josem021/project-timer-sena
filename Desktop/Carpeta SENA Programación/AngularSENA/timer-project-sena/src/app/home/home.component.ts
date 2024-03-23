import { Component } from '@angular/core';

import { ScoredComponent } from '../components/scored/scored.component';
import { TimerMainComponent } from '../components/timer-main/timer-main.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeComponent, TimerMainComponent, ScoredComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
