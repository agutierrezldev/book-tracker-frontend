import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorDTO, PageableAuthorDTO } from '../../models/AuthorDTO';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  
  private apiUrl = `${environment.apiBaseUrl}/authors`;

  constructor(private http: HttpClient) { }

  getAllPageable(page: number, size: number): Observable<PageableAuthorDTO> {
    return this.http.get<PageableAuthorDTO>(`${this.apiUrl}/pageable?page=${page}&size=${size}`);
  }

  getAll(): Observable<AuthorDTO[]> {
    return this.http.get<AuthorDTO[]>(`${this.apiUrl}`);
  }
  
  create(author: AuthorDTO): Observable<AuthorDTO> {
    return this.http.post<AuthorDTO>(this.apiUrl, author);
  }

  getById(id: number): Observable<AuthorDTO> {
    return this.http.get<AuthorDTO>(`${this.apiUrl}/${id}`);
  }

  update(id: number, author: AuthorDTO): Observable<AuthorDTO> {
    return this.http.put<AuthorDTO>(`${this.apiUrl}/${id}`, author);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
