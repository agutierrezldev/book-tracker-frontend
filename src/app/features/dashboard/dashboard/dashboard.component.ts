
import { Component } from '@angular/core';
import { DashboardDTO } from '../../../core/models/DashboardDTO';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  dashboard: DashboardDTO = {
    totalBooks: 0,
    totalAuthors: 0,
    totalLoans: 0,
    activeLoans: 0,
    finishedLoans: 0,
  };

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.dashboardService.getAll().subscribe((data: DashboardDTO) => {
      this.dashboard = data;
    });
  }

}
