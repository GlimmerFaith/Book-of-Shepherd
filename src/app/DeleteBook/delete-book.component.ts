// delete-book.component.ts
import { Component, OnInit } from '@angular/core';
import { BookService } from '../Book/book.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-delete-book',
  templateUrl: './delete-book.component.html',
  styleUrls: ['./delete-book.component.css'],
})
export class DeleteBookComponent implements OnInit {
    bookId: string = '';
    book: any;
    isDeleteMode: boolean = false;
    showConfirmation: boolean = false;
  
    constructor(private route: ActivatedRoute, 
        private bookService: BookService,
        private router: Router
        ) {}
  
    ngOnInit(): void {
      this.route.params.subscribe((params) => {
        this.bookId = params['id'];
        this.loadBook();
      });
    }
  
    loadBook() {
      this.bookService.showOneBook(this.bookId).subscribe((book) => {
        this.book = book;
      });
    }
  
    onDelete() {
      // Call the service to delete the book
      this.bookService.deleteBook(this.bookId).subscribe(
        (response) => {
          console.log('Book deleted successfully:', response);
          // Add any confirmation message or navigation logic here
          this.isDeleteMode = true;
          this.showConfirmation = true;
        },
        (error) => {
          console.error('Error deleting book:', error);
          // Add error handling logic here
        }
      );
    }

    redirectToBooks() {
        // 使用路由导航到图书页面
        this.router.navigate(['/books']);
      }

  }