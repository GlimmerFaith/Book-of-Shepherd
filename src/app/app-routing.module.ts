import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './HomePage/homepage.component';
import { BookListComponent } from './BookList/book-list.component';
import { BookInfoComponent } from './BookInfo/book-info.component';
import { AddBookComponent } from './AddBook/add-book.component';
import { EditBookComponent } from './EditBook/edit-book.component';
import { DeleteBookComponent } from './DeleteBook/delete-book.component';
import { SearchBookComponent } from './SearchBook/search-book.component';
import { LoginComponent } from './LoginUser/login.component';
import { RegisterComponent } from './RegisterUser/register.component';
import { UserComponent } from './User/user.component';
import { AuthGuard } from './Authenticate/auth.guard';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'books', component: BookListComponent },
  { path: 'book/:id', component: BookInfoComponent },
  { path: 'add', component: AddBookComponent },
  { path: 'edit', component: EditBookComponent },
  { path: 'delete', component: DeleteBookComponent },
  { path: 'search', component: SearchBookComponent },

  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
