import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { AuthorListComponent } from './author-list/author-list.component';
import { AuthorCreateComponent } from './author-create/author-create.component';
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoanCreateComponent } from './loan-create/loan-create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthorEditComponent } from './author-edit/author-edit.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { LoanEditComponent } from './loan-edit/loan-edit.component';

export const routes: Routes = [
  { path: 'books', component: BookListComponent },
  { path: 'books/create', component: BookCreateComponent },
  { path: 'books/edit/:id', component: BookEditComponent },
  { path: 'authors', component: AuthorListComponent },
  { path: 'authors/create', component: AuthorCreateComponent },
  { path: 'authors/edit/:id', component: AuthorEditComponent },
  { path: 'loans', component: LoanListComponent },
  { path: 'loans/create', component: LoanCreateComponent },
  { path: 'loans/edit/:id', component: LoanEditComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
