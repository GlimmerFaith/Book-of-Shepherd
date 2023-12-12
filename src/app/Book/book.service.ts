import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book, Review } from './book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:5000/api/books';

  constructor(private http: HttpClient) { }

  showAllBooks(page: number, pageSize: number): Observable<Book[]> {
    const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<Book[]>(url);
  }

  showOneBook(book_id: string): Observable<Book | undefined> {
    const url = `${this.apiUrl}/${book_id}`;
    return this.http.get<Book>(url);
  }

  addBook(bookData: any): Observable<any> {
    return this.http.post(this.apiUrl, bookData);
  }

  editBook(bookId: string, updatedBookData: any): Observable<any> {
    const url = `${this.apiUrl}/${bookId}`;
    return this.http.put(url, updatedBookData);
  }

  deleteBook(bookId: string): Observable<any> {
    const url = `${this.apiUrl}/${bookId}`;
    return this.http.delete(url);
  }

  searchBooksByTitle(title: string): Observable<Book[]> {
    const url = `${this.apiUrl}/title/${title}`;
    return this.http.get<Book[]>(url);
  }

  addReview(bookId: string, username: string, comment: string, stars: number): Observable<any> {
    const reviewData = { username, comment, stars };
    return this.http.post(`${this.apiUrl}/${bookId}/reviews`, reviewData);
  }


}
