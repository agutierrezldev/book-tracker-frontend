import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookDTO } from '../core/models/BookDTO';
import { LoanService } from '../core/services/loan.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BookService } from '../core/services/book.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoanDTO } from '../core/models/LoanDTO';
import { catchError, of, tap } from 'rxjs';
import { AlertService } from '../core/services/alert.services';

@Component({
  selector: 'app-loan-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './loan-create.component.html',
  styleUrl: './loan-create.component.css'
})
export class LoanCreateComponent implements OnInit {
  loanForm: FormGroup;
  books: BookDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private bookService: BookService,
    private toastr: ToastrService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loanForm = this.fb.group({
      bookId: ['', Validators.required],
      loanDate: ['', [Validators.required, this.dateValidator]],
      returnDate: ['', [Validators.required, this.dateValidator]],
      status: ['Activo', Validators.required]
    });
  }

  get bookId() {
    return this.loanForm.get('bookId');
  }

  get loanDate() {
    return this.loanForm.get('loanDate');
  }

  get returnDate() {
    return this.loanForm.get('returnDate');
  }

  get status() {
    return this.loanForm.get('status');
  }

  dateValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { 'invalidDate': true };
    }
    return null;
  }


  ngOnInit(): void {
    this.bookService.getAll().subscribe((data) => {
      this.books = data;
    });
  }

  create() {
    const bookId = Number(this.loanForm.get('bookId')?.value);
    const loanDate = this.loanForm.get('loanDate')?.value;
    const returnDate = this.loanForm.get('returnDate')?.value;
    const status = this.loanForm.get('status')?.value; 

    this.bookService.getById(bookId).subscribe((book: BookDTO) => {
      const loan: LoanDTO = {
        id: 0,
        book: book,
        loanDate: loanDate,
        returnDate: returnDate,
        status: status,
      };

      this.loanService.create(loan).pipe(
        tap(response => {
          console.log(response)
          this.toastr.success('Préstamo registrado correctamente.', '¡Éxito!');
          this.router.navigate(['/loans']); 
        }),
        catchError(error => {
          console.log(error)
          this.toastr.error('Hubo un error al registrar el préstamo.', 'Error');
          return of([]);
        })
      ).subscribe();
    });
  }

  onSubmit(): void {
    if (this.loanForm.invalid) {
      return;
    }

    this.alertService.confirm('¿Registrar Préstamo?', `¿Seguro que quieres registrar Préstamo?`)
      .then(result => {
        if (result.isConfirmed) {
          this.create();
        }
      });
  }

}
