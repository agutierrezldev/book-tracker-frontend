import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  confirm(
    title: string, 
    text: string, 
    icon: SweetAlertIcon = 'warning'
  ): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });
  }

  success(message: string, title: string = 'Éxito'): void {
    Swal.fire({
      title,
      text: message,
      icon: 'success',
      timer: 3000,
      showConfirmButton: false
    });
  }

  error(message: string, title: string = 'Error'): void {
    Swal.fire({
      title,
      text: message,
      icon: 'error',
      timer: 3000,
      showConfirmButton: false
    });
  }
}
