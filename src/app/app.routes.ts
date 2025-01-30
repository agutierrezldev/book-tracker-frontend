import { Routes } from '@angular/router';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookCreateComponent } from './features/books/book-create/book-create.component';
import { BookEditComponent } from './features/books/book-edit/book-edit.component';
import { AuthorListComponent } from './features/authors/author-list/author-list.component';
import { AuthorCreateComponent } from './features/authors/author-create/author-create.component';
import { AuthorEditComponent } from './features/authors/author-edit/author-edit.component';
import { LoanListComponent } from './features/loans/loan-list/loan-list.component';
import { LoanCreateComponent } from './features/loans/loan-create/loan-create.component';
import { LoanEditComponent } from './features/loans/loan-edit/loan-edit.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';

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
