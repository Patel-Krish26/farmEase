import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  // Dynamic year for the copyright
  year: number = new Date().getFullYear();

  currentUser: any = null;
  constructor(public auth: AuthService) { }
 

  ngOnInit(): void {
    const storedData = localStorage.getItem("CurrentUser");
    if (storedData) {
      this.currentUser = JSON.parse(storedData);
    }
  }
}
