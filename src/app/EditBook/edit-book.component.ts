import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../Book/book.service';


@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
})
export class EditBookComponent implements OnInit {
  bookId: string = '';
  book: any;
  updatedBook: any;
  isEditMode: boolean = false;
  showConfirmation: boolean = false;

  constructor(private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.bookId = params['id'];
      this.loadBook();
    });
  }

  loadBook() {
    this.bookService.showOneBook(this.bookId).subscribe((book) => {
      this.book = book;
      this.updatedBook = { ...this.book };
    });
  }

  onEdit() {
    this.isEditMode = true;
  }

  onCancelEdit() {
    this.isEditMode = false;
    this.loadBook();
  }

  onSaveChanges() {
    this.bookService.editBook(this.bookId, this.updatedBook).subscribe(
      (response) => {
        console.log('Book edited successfully:', response);
        this.isEditMode = true;
        this.showConfirmation = true;
      },
      (error) => {
        console.error('Error editing book:', error)
      }
    );
  }
  redirectToBooks() {
    this.router.navigate(['/books']);
  }

}
