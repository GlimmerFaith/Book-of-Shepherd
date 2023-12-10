import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello/hello.component';
import { HomePageComponent } from './HomePage/homepage.component';
import { BookListComponent } from './BookList/book-list.component';
import { BookService } from './Book/book.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BookInfoComponent } from './BookInfo/book-info.component';
import { AddBookComponent } from './AddBook/add-book.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditBookComponent } from './EditBook/edit-book.component';
import { DeleteBookComponent } from './DeleteBook/delete-book.component';
import { SearchBookComponent } from './SearchBook/search-book.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    HomePageComponent,
    BookListComponent,
    BookInfoComponent,
    AddBookComponent,
    EditBookComponent,
    DeleteBookComponent,
    SearchBookComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxPaginationModule,
    FormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule, 
    ReactiveFormsModule
  ],
  providers: [
    BookService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: false }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
