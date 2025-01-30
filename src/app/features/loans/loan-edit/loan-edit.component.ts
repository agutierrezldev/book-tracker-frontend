import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { LoanService } from '../../../core/services/loan/loan.service';
import { BookService } from '../../../core/services/book/book.service';
import { AlertService } from '../../../core/services/util/alert.services';
import { BookDTO } from '../../../core/models/BookDTO';
import { LoanDTO } from '../../../core/models/LoanDTO';

@Component({
  selector: 'app-loan-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './loan-edit.component.html',
  styleUrl: './loan-edit.component.css'
})
export class LoanEditComponent implements OnInit {
  loanForm: FormGroup;
  loanId!: number;
  books: BookDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private bookService: BookService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loanForm = this.fb.group({
      bookId: ['', Validators.required],
      loanDate: ['', [Validators.required, this.dateValidator]],
      returnDate: ['', [Validators.required, this.dateValidator]],
      status: ['', Validators.required]
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

  getAllBooks() {
    this.bookService.getAll().subscribe((data: BookDTO[]) => {
      this.books = data;
    });
  }

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('id'));
    this.getById();
    this.getAllBooks();
  }

  getById(): void {
    this.loanService.getById(this.loanId).subscribe((data: LoanDTO) => {
      this.loanForm.patchValue({
        loanDate: data.loanDate,
        bookId: data.book?.id,
        returnDate: data.returnDate,
        status: data.status
      });
    });
  }

  update() {
    const bookId = Number(this.loanForm.get('bookId')?.value);
    const loanDate = this.loanForm.get('loanDate')?.value;
    const returnDate = this.loanForm.get('returnDate')?.value;
    const status = this.loanForm.get('status')?.value;

    this.bookService.getById(bookId).subscribe((book: BookDTO) => {
      const loan: LoanDTO = {
        id: this.loanId,
        book: book,
        loanDate: loanDate,
        returnDate: returnDate,
        status: status,
      };

      this.loanService.create(loan).pipe(
        tap(response => {
          console.log(response)
          this.toastr.success('Préstamo actualizado correctamente.', '¡Éxito!');
          this.router.navigate(['/loans']);
        }),
        catchError(error => {
          console.log(error)
          this.toastr.error('Hubo un error al actualizar préstamo.', 'Error');
          return of([]);
        })
      ).subscribe();
    });
  }

  onSubmit(): void {
    if (this.loanForm.invalid) {
      return;
    }

    this.alertService.confirm('¿Editar Préstamo?', `¿Seguro que quieres editar Préstamo?`)
      .then(result => {
        if (result.isConfirmed) {
          this.update();
        }
      });
  }



}
