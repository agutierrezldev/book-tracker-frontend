import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardDTO } from '../../models/DashboardDTO';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

 private apiUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(`${this.apiUrl}`);
  }
}
