import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookDTO, PageableBookDTO } from '../../models/BookDTO';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = `${environment.apiBaseUrl}/books`;

  constructor(private http: HttpClient) { }

  getAllPageable(page: number, size: number): Observable<PageableBookDTO> {
    return this.http.get<PageableBookDTO>(`${this.apiUrl}/pageable?page=${page}&size=${size}`);
  }

  getAll(): Observable<BookDTO[]> {
    return this.http.get<BookDTO[]>(`${this.apiUrl}`);
  }

  create(book: BookDTO): Observable<BookDTO> {
    return this.http.post<BookDTO>(this.apiUrl, book);
  }

  getById(id: number): Observable<BookDTO> {
    return this.http.get<BookDTO>(`${this.apiUrl}/${id}`);
  }

  update(id: number, book: BookDTO): Observable<BookDTO> {
    return this.http.put<BookDTO>(`${this.apiUrl}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
