import { Component } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private scrollService: ScrollService) { }

  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    this.scrollService.scrollTo(sectionId);
  }
}
