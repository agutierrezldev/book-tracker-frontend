import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardDTO } from '../models/DashboardDTO';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:9080/api/book-tracker-service/dashboard';

  constructor(private http: HttpClient) { }

  getAll(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(`${this.apiUrl}`);
  }
}
