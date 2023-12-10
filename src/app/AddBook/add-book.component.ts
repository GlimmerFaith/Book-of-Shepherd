import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../Book/book.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent {
    // Define properties to bind to the form fields
    author: string = '';
    country: string = '';
    imageLink: string = '';
    language: string = '';
    link: string = '';
    pages: number | undefined ;
    title: string = '';
    year: number | undefined ;

    showConfirmation = false;
  
    constructor(private bookService: BookService, private router: Router) {}
  
    // Function to handle form submission
    onSubmit() {
      // Prepare book data object
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
  
      // Call the BookService to add the book
      this.bookService.addBook(bookData).subscribe(
        response => {
          // Navigate to the details page of the newly added book
          this.router.navigate(['/book', response._id]);
        },
        error => {
          console.error('Error adding book:', error);
          // Handle error as needed
        }
      );
      this.showConfirmation = true;
    }

    redirectToBooks() {
        // 重定向到书籍列表组件
        this.router.navigate(['/books']);
      }


      
}

