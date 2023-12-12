import { Component, OnInit, ViewChild } from '@angular/core';
import { Book, Review } from '../Book/book.model';
import { BookService } from '../Book/book.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>();
  booksList: Book[] = [];

  currentPage = 1;
  pageSize = 20;
  totalBooks: number = 0;

  constructor(private bookService: BookService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchBooks();
    this.loadBooks();
  }

  calculateRange(): string {
    const startIndex = (this.currentPage - 1) * this.pageSize + 1;
    const endIndex = Math.min(this.currentPage * this.pageSize, this.totalBooks);
    return `${startIndex} - ${endIndex} of ${this.totalBooks}`;
  }

  loadBooks(): void {
    this.bookService.showAllBooks(this.currentPage, this.pageSize)
      .subscribe(
        (response: any) => {
          this.booksList = response.books;
          this.totalBooks = response.totalBooks;
        },
        (error) => {
          console.error('Error loading books:', error);
        }
      );
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadBooks();
  }
  loadNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBooks();
    }
  }
  get totalPages(): number {
    return Math.ceil(this.totalBooks / this.pageSize);
  }

  loadPreviousPage(): void {
    this.currentPage--;
    this.loadBooks();
  }

  fetchBooks(): void {
    this.bookService.showAllBooks(this.paginator?.pageIndex, this.paginator?.pageSize).subscribe(
      (books: Book[]) => {
        this.booksList = books;
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  sanitizeImageUrl(imageLink: string): any {
    const fileName = imageLink.split('/').pop() || '';
    const fileNameWithoutExtension = fileName.split('.').shift() || '';
    const imageUrl = `assets/image/bookInfo/${fileNameWithoutExtension}.jpg`;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }


}
