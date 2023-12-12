import { Component, Input, OnInit } from '@angular/core';
import { BookService } from '../Book/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../Book/book.model';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.css'],
})
export class SearchBookComponent implements OnInit {
  @Input() searchTerm: string = '';
  books: Book[] = [];

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['term'] || '';
      this.searchAndDisplay();
    });
  }

  searchAndDisplay() {
    if (this.searchTerm) {
      this.bookService.searchBooksByTitle(this.searchTerm).subscribe(
        (books: Book[]) => {
          this.books = books;
        },
        error => {
          console.error('Error fetching books:', error);
        }
      );
    }
  }

  sanitizeImageUrl(imageLink: string): any {
    const fileName = imageLink.split('/').pop() || '';
    const fileNameWithoutExtension = fileName.split('.').shift() || '';
    const imageUrl = `assets/image/bookInfo/${fileNameWithoutExtension}.jpg`;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }


}