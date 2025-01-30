import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthorService } from '../../../core/services/author/author.service';
import { AlertService } from '../../../core/services/util/alert.services';
import { AuthorDTO } from '../../../core/models/AuthorDTO';

@Component({
  selector: 'app-author-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './author-create.component.html',
  styleUrl: './author-create.component.css'
})
export class AuthorCreateComponent implements OnInit {

  authorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private toastr: ToastrService,
    private router: Router,
    private alertService: AlertService,
  ) {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      nationality: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required, this.dateValidator]],
    });
  }

  ngOnInit(): void {
  }

  get name() {
    return this.authorForm.get('name');
  }

  get nationality() {
    return this.authorForm.get('nationality');
  }

  get birthDate() {
    return this.authorForm.get('birthDate');
  }

  dateValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { 'invalidDate': true };
    }
    return null;
  }

  create() {
    const author: AuthorDTO = this.authorForm.value;
    this.authorService.create(author).pipe(
      tap(response => {
        console.log(response)
        this.toastr.success('El autor ' + this.authorForm.get('name')?.value +
          ' se ha registrado correctamente.', '¡Éxito!');
        this.router.navigate(['/authors']);
      }),
      catchError(error => {
        console.log(error)
        this.toastr.error('Hubo un error al actualizar el autor.', 'Error');
        return of([]);
      })
    ).subscribe();
  }

  onSubmit(): void {
    if (this.authorForm.invalid) {
      return;
    }

    this.alertService.confirm('¿Registrar autor?', `¿Seguro que quieres registrar a ${this.authorForm.get('name')?.value}?`)
      .then(result => {
        if (result.isConfirmed) {
          this.create();
        }
      });

  }

}
