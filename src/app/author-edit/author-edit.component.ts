import { Component, OnInit } from '@angular/core';
import { AuthorDTO } from '../core/models/AuthorDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from '../core/services/author.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, tap } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from '../core/services/alert.services';

@Component({
  selector: 'app-author-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './author-edit.component.html',
  styleUrl: './author-edit.component.css'
})
export class AuthorEditComponent implements OnInit {
  authorForm: FormGroup;
  authorId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private router: Router,
    private toastr: ToastrService,
    private alertService: AlertService,
  ) {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      nationality: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required, this.dateValidator]],
    });
  }

  ngOnInit(): void {
    this.authorId = Number(this.route.snapshot.paramMap.get('id'));
    this.getById();
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

  getById(): void {
    this.authorService.getById(this.authorId).subscribe((data: AuthorDTO) => {
      this.authorForm.patchValue({
        name: data.name,
        nationality: data.nationality,
        birthDate: data.birthDate,
      });
    });
  }

  update(): void {
    this.authorService.update(this.authorId, this.authorForm.value).pipe(
      tap(response => {
        console.log(response)
        this.toastr.success('El autor ' + this.authorForm.get('name')?.value +
          ' se ha actualizado correctamente.', '¡Éxito!');
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

    this.alertService.confirm('¿Editar autor?', `¿Seguro que quieres editar a ${this.authorForm.get('name')?.value}?`)
      .then(result => {
        if (result.isConfirmed) {
          this.update();
        }
      });

  }

}
