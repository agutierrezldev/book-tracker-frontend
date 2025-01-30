import { Component, OnInit } from '@angular/core';
import { BookDTO } from '../core/models/BookDTO';
import { AlertService } from '../core/services/alert.services';
import { BookService } from '../core/services/book.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books: BookDTO[] = []
  totalPages: number = 0;
  totalElements: number = 0;
  page: number = 1;
  size: number = 5;

  constructor(
    private alertService: AlertService,
    private bookService: BookService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllPageable();
  }

  getAllPageable(): void {
    this.bookService.getAllPageable(this.page - 1, this.size).pipe(
      tap(response => {
        this.books = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      }),
      catchError(error => {
        console.error('Hubo un error al obtener los libros', error);
        return of([]);
      })
    ).subscribe();
  }

  changePage(newPage: number): void {
    this.page = newPage;
    this.getAllPageable();
  }

  create() {
    this.router.navigate(['/books/create']);
  }

  edit(book: BookDTO) {
    this.router.navigate([`/books/edit/${book.id}`]);
  }

  delete(book: BookDTO) {
    this.bookService.delete(book.id).subscribe(() => {
      this.alertService.success('Libro eliminado correctamente');
      this.getAllPageable();
    })
  }

  confirm(book: BookDTO): void {
    this.alertService.confirm('¿Eliminar libro?', `¿Seguro que quieres eliminar a ${book.title}?`)
      .then(result => {
        if (result.isConfirmed) {
          this.delete(book);
        }
      });
  }


}
