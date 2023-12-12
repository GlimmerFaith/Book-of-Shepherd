import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Book, Review } from '../Book/book.model';
import { BookService } from '../Book/book.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-book-info',
    templateUrl: './book-info.component.html',
    styleUrls: ['./book-info.component.css'],
    encapsulation: ViewEncapsulation.Emulated
  })
  export class BookInfoComponent implements OnInit {
    @Input() bookId: string | undefined;
    book: Book | undefined ;
    newReview: { username: string; comment: string; stars: number } = {
      username: '',
      comment: '',
      stars: 0,
    };
    showForm: boolean = false;
  
    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private sanitizer: DomSanitizer
      ) {}
  
    ngOnInit(): void {
        this.route.params.subscribe((params) => {
          this.bookId = params['id'];
          this.loadBookDetails();
        });
      }
  
    private loadBookDetails(): void {
      if (this.bookId) {
        this.bookService.showOneBook(this.bookId).subscribe(
          (book) => {
            this.book = book;
          },
          (error) => {
            console.error('Error loading book details:', error);
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

  addReview(): void {
    if (this.bookId) {
      this.bookService
        .addReview(this.bookId, this.newReview.username, this.newReview.comment, this.newReview.stars)
        .subscribe(
          (response) => {
            this.loadBookDetails();
            console.log('Review added successfully:', response);
          },
          (error) => {
            console.error('Error adding review:', error);
          }
        );
    }
  }

  
}