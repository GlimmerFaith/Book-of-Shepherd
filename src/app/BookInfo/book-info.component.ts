import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Book } from '../Book/book.model';
import { BookService } from '../Book/book.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'app-book-info',
    templateUrl: './book-info.component.html',
    styleUrls: ['./book-info.component.css'],
    encapsulation: ViewEncapsulation.Emulated // 默认值，可以不写
  })
  export class BookInfoComponent implements OnInit {
    @Input() bookId: string | undefined;
    book: Book | undefined ;
  
    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private sanitizer: DomSanitizer
      ) {}
  
    ngOnInit(): void {
        // 从路由参数中获取 bookId
        this.route.params.subscribe((params) => {
          this.bookId = params['id'];
          // 根据 bookId 加载书籍详细信息
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