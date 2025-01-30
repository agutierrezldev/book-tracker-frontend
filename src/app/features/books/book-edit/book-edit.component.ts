import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AuthorDTO } from '../../../core/models/AuthorDTO';
import { AuthorService } from '../../../core/services/author/author.service';
import { BookService } from '../../../core/services/book/book.service';
import { AlertService } from '../../../core/services/util/alert.services';
import { BookDTO } from '../../../core/models/BookDTO';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.css'
})
export class BookEditComponent implements OnInit {
  bookForm: FormGroup;
  bookId!: number;
  authors: AuthorDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.getById();
    this.getAllAuthors();
  }

  getById(): void {
    this.bookService.getById(this.bookId).subscribe((data: BookDTO) => {
      this.bookForm.patchValue({
        title: data.title,
        authorId: data.author?.id,
        isbn: data.isbn,
        publicationDate: data.publicationDate,
        available: data.available
      });
    });
  }

  update() {
    const book: BookDTO = {
      id: this.bookId,
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
    this.bookService.update(book.id, book).pipe(
      tap(response => {
        console.log(response)
        this.toastr.success('El libro ' + this.bookForm.get('title')?.value +
          ' se ha actualizado correctamente.', '¡Éxito!');
        this.router.navigate(['/books']);
      }),
      catchError(error => {
        console.log(error)
        this.toastr.error('Hubo un error al actualizar el book.', 'Error');
        return of([]);
      })
    ).subscribe();
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    this.alertService.confirm('¿Editar autor?', `¿Seguro que quieres editar a ${this.bookForm.get('title')?.value}?`)
      .then(result => {
        if (result.isConfirmed) {
          this.update();
        }
      });
  }


}
