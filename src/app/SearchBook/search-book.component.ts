// search-book.component.ts

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
    ) {}
  
    ngOnInit() {
      // Subscribe to changes in the route parameters
      this.route.queryParams.subscribe(params => {
        this.searchTerm = params['term'] || ''; // Get the 'term' query parameter or set to empty string
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
      // 使用 split('/') 分割字符串，取最后一部分作为文件名
      const fileName = imageLink.split('/').pop() || ''; // 如果数组为空，使用空字符串
    
      // 移除文件扩展名
      const fileNameWithoutExtension = fileName.split('.').shift() || ''; // 如果数组为空，使用空字符串
    
      // 构建安全的 URL
      const imageUrl = `assets/image/bookInfo/${fileNameWithoutExtension}.jpg`;
    
      // 通过 DomSanitizer 信任 URL
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
  



  }