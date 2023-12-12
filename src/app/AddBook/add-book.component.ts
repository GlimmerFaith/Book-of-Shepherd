import { Component } from '@angular/core';
import { BookService } from '../Book/book.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent {

  author: string = '';
  country: string = '';
  imageLink: string = '';
  language: string = '';
  link: string = '';
  pages: number | undefined;
  title: string = '';
  year: number | undefined;
  showConfirmation = false;

  constructor(private bookService: BookService, private router: Router) { }

  onSubmit() {
    const bookData = {
      author: this.author,
      country: this.country,
      imageLink: this.imageLink,
      language: this.language,
      link: this.link,
      pages: this.pages,
      title: this.title,
      year: this.year
    };
    this.bookService.addBook(bookData).subscribe(
      response => {
        this.router.navigate(['/book', response._id]);
      },
      error => {
        console.error('Error adding book:', error);
      }
    );
    this.showConfirmation = true;
  }

  redirectToBooks() {
    this.router.navigate(['/books']);
  }

}

