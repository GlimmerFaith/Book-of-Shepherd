import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { LoginComponent } from './LoginUser/login.component';
import { RegisterComponent } from './RegisterUser/register.component';
import { UserComponent } from './User/user.component';
import { AuthService } from './Authenticate/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    BookListComponent,
    BookInfoComponent,
    AddBookComponent,
    EditBookComponent,
    DeleteBookComponent,
    SearchBookComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,

  ],
  imports: [
    RouterModule.forRoot([]),
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxPaginationModule,
    FormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  providers: [
    AuthService,
    BookService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: false }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
