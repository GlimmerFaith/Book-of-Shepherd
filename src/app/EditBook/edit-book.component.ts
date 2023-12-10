// edit-book.component.ts

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
  book: any; // 修改为 any 类型，因为我们可能编辑的信息比 Book 模型更多
  updatedBook: any; // 修改为 any 类型，以匹配 book 模型的属性
  isEditMode: boolean = false; // 用于控制显示编辑还是确认视图
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
      // 初始化 updatedBook，保留原始书籍信息，以便编辑时使用
      this.updatedBook = { ...this.book };
    });
  }

  onEdit() {
    // 将 isEditMode 设置为 true，切换到编辑模式
    this.isEditMode = true;
  }
  
  onCancelEdit() {
    // 将 isEditMode 设置为 false，取消编辑模式
    this.isEditMode = false;
  
    // 重新加载书籍信息，以便恢复到原始状态
    this.loadBook();
  }

  onSaveChanges() {
    // 调用服务进行保存修改的逻辑
    this.bookService.editBook(this.bookId, this.updatedBook).subscribe(
      (response) => {
        console.log('Book edited successfully:', response);
        // 在保存成功后，将 isEditMode 设置为 false，切回确认视图
        this.isEditMode = true;
        this.showConfirmation = true;
      },
      (error) => {
        console.error('Error editing book:', error);
        // 可以在这里添加错误处理逻辑
      }
    );
  }
  redirectToBooks() {
    // 使用路由导航到图书页面
    this.router.navigate(['/books']);
  }

}
