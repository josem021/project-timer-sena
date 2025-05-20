import { CommonModule } from '@angular/common';
import { ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { Subscription } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('Home', { static: false }) homeSection!: ElementRef;
  @ViewChild('Projects', { static: false }) projectsSection!: ElementRef;
  @ViewChild('Contacts', { static: false }) contactsSection!: ElementRef;

  private scrollSubscription: Subscription | null = null;

  constructor(private scrollService: ScrollService) {}

  ngAfterViewInit(): void {
    this.scrollSubscription = this.scrollService.scrollToSection$.subscribe(sectionId => {
      this.scrollToSection(sectionId);
    });
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  scrollToSection(sectionId: string) {
    let element: HTMLElement | null = null;
    switch (sectionId) {
      case 'Home':
        element = this.homeSection.nativeElement;
        break;
      case 'Projects':
        element = this.projectsSection.nativeElement;
        break;
      case 'Contacts':
        element = this.contactsSection.nativeElement;
        break;
    }

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}