import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './HomePage/homepage.component';
import { BookListComponent } from './BookList/book-list.component';
import { BookInfoComponent } from './BookInfo/book-info.component';
import { AddBookComponent } from './AddBook/add-book.component';
import { EditBookComponent } from './EditBook/edit-book.component';
import { DeleteBookComponent } from './DeleteBook/delete-book.component';
import { SearchBookComponent } from './SearchBook/search-book.component';


const routes: Routes = [
  // your routes here
  { path:'', component : HomePageComponent},
  { path:'books',component : BookListComponent},
  { path: 'book/:id', component: BookInfoComponent },
  { path: 'add', component: AddBookComponent },
  { path: 'edit', component: EditBookComponent },
  { path: 'delete', component: DeleteBookComponent },
  { path: 'search', component: SearchBookComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
