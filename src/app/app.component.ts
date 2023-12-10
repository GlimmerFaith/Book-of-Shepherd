import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Book of Shepherd';

  constructor(private router: Router) {}
  searchTerm: string = '';

  onSearch() {
    this.router.navigate(['/search'], { queryParams: { term: this.searchTerm } });
  }


}
