import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorDTO } from '../core/models/AuthorDTO';
import { AuthorService } from '../core/services/author.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AlertService } from '../core/services/alert.services';
import { BookDTO } from '../core/models/BookDTO';
import { BookService } from '../core/services/book.service';
import { catchError, of, tap } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-book-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './book-create.component.html',
  styleUrl: './book-create.component.css'
})
export class BookCreateComponent implements OnInit {
  bookForm: FormGroup;
  authors: AuthorDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private bookService: BookService,
    private toastr: ToastrService,
    private router: Router,
    private alertService: AlertService,
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      authorId: ['', Validators.required],
      isbn: ['', [Validators.required]],
      publicationDate: ['', [Validators.required, this.dateValidator]],
      available: ['', Validators.required]
    });
  }

  get title() {
    return this.bookForm.get('title');
  }

  get authorId() {
    return this.bookForm.get('authorId');
  }

  get isbn() {
    return this.bookForm.get('isbn');
  }

  get publicationDate() {
    return this.bookForm.get('publicationDate');
  }

  get available() {
    return this.bookForm.get('available');
  }

  dateValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { 'invalidDate': true };
    }
    return null;
  }

  getAllAuthors() {
    this.authorService.getAll().subscribe((data: AuthorDTO[]) => {
      this.authors = data;
    });
  }

  ngOnInit(): void {
    this.getAllAuthors();
  }

  create() {
    const book: BookDTO = {
      id: 0,
      title: this.bookForm.get('title')?.value,
      author: {
        id: Number(this.bookForm.get('authorId')?.value),
        name: '',
        nationality: '',
        birthDate: '',
      },
      isbn: this.bookForm.get('isbn')?.value,
      publicationDate: this.bookForm.get('publicationDate')?.value,
      available: this.bookForm.get('available')?.value === 'true',
    }
    this.bookService.create(book).pipe(
      tap(response => {
        console.log(response)
        this.toastr.success('El libro ' + this.bookForm.get('title')?.value +
          ' se ha registrado correctamente.', '¡Éxito!');
        this.router.navigate(['/books']);
      }),
      catchError(error => {
        console.log(error)
        this.toastr.error('Hubo un error al registrar el book.', 'Error');
        return of([]);
      })
    ).subscribe();
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    this.alertService.confirm('¿Registrar autor?', `¿Seguro que quieres registrar a ${this.bookForm.get('title')?.value}?`)
      .then(result => {
        if (result.isConfirmed) {
          this.create();
        }
      });
  }

}
