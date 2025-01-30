import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoanDTO, PageableLoanDTO } from '../models/LoanDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = 'http://localhost:9080/api/book-tracker-service/loans';

  constructor(private http: HttpClient) { }

  getAllPageable(page: number, size: number, bookId?: number): Observable<PageableLoanDTO> {
    let url = `${this.apiUrl}?page=${page}&size=${size}`;
    if (bookId) {
      url += `&bookId=${bookId}`;
    }
    return this.http.get<PageableLoanDTO>(url);
  }

  create(loan: LoanDTO): Observable<LoanDTO> {
    return this.http.post<LoanDTO>(this.apiUrl, loan);
  }

  getById(bookId: number): Observable<LoanDTO> {
    return this.http.get<LoanDTO>(`${this.apiUrl}/${bookId}`);
  }

  update(id: number, loan: LoanDTO): Observable<LoanDTO> {
    return this.http.put<LoanDTO>(`${this.apiUrl}/${id}`, loan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  isBookAvailable(bookId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/available/${bookId}`);
  }
}
