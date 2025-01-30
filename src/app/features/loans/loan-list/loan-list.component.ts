import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../core/services/util/alert.services';
import { LoanService } from '../../../core/services/loan/loan.service';
import { BookService } from '../../../core/services/book/book.service';
import { BookDTO } from '../../../core/models/BookDTO';
import { LoanDTO } from '../../../core/models/LoanDTO';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.css'
})
export class LoanListComponent implements OnInit {
  loans: LoanDTO[] = [];
  books: BookDTO[] = [];
  currentPage: number = 0;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  selectedBookId: number | 0 = 0;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private loanService: LoanService,
    private bookService: BookService) { }

  ngOnInit() {
    this.getAllBooks();
    this.getAllPageable();
  }


  getAllBooks() {
    this.bookService.getAll().subscribe((data: BookDTO[]) => {
      this.books = data;
    });
  }

  getAllPageable(): void {
    this.loanService.getAllPageable(this.currentPage, this.pageSize, this.selectedBookId).pipe(
      tap(response => {
        this.loans = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      }),
      catchError(error => {
        console.error('Hubo un error al obtener los prestamos', error);
        return of([]);
      })
    ).subscribe();
  }

  changePage(page: number): void {
    if (page >= 0 && page < Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPage = page;
      this.getAllPageable();
    }
  }

  create() {
    this.router.navigate(['/loans/create']);
  }

  edit(loan: LoanDTO) {
    this.router.navigate([`/loans/edit/${loan.id}`]);
  }

  filterByBook() {
    this.currentPage = 0; 
    this.getAllPageable();
  }

  delete(loan: LoanDTO) {
    this.loanService.delete(loan.id).subscribe(() => {
      this.alertService.success('Préstamo eliminado correctamente');
      this.getAllPageable();
    })
  }

  confirm(loan: LoanDTO): void {
    this.alertService.confirm('¿Eliminar Préstamo?', `¿Seguro que quieres eliminar Préstamo?`)
      .then(result => {
        if (result.isConfirmed) {
          this.delete(loan);
        }
      });
  }

}
