import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AlertService } from '../../../core/services/util/alert.services';
import { AuthorService } from '../../../core/services/author/author.service';
import { AuthorDTO } from '../../../core/models/AuthorDTO';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css'
})
export class AuthorListComponent implements OnInit {
  authors: AuthorDTO[] = []
  totalPages: number = 0;
  totalElements: number = 0;
  page: number = 1;
  size: number = 5;

  constructor(
    private alertService: AlertService,
    private authorService: AuthorService, 
    private router: Router) { }

  ngOnInit(): void {
    this.getAllPageable();
  }

  getAllPageable(): void {
    this.authorService.getAllPageable(this.page - 1, this.size).pipe(
      tap(response => {
        this.authors = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      }),
      catchError(error => {
        console.error('Hubo un error al obtener los autores', error);
        return of([]);
      })
    ).subscribe();
  }

  changePage(newPage: number): void {
    this.page = newPage;
    this.getAllPageable();
  }
  
  create() {
    this.router.navigate(['/authors/create']);
  }

  edit(author: AuthorDTO) {
    this.router.navigate([`/authors/edit/${author.id}`]);
  }

  delete(author: AuthorDTO) {
    this.authorService.delete(author.id).subscribe(() => {
      this.alertService.success('Autor eliminado correctamente');
      this.getAllPageable();
    })
   }

  confirm(author: AuthorDTO): void {
    this.alertService.confirm('¿Eliminar autor?', `¿Seguro que quieres eliminar a ${author.name}?`)
      .then(result => {
        if (result.isConfirmed) {
          this.delete(author);
        }
      });
  }
}
