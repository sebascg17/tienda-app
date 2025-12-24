import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();

  private counter = 0;

  showSuccess(message: string, title: string = 'Éxito') {
    this.toastSubject.next({ type: 'success', title, message, id: ++this.counter });
  }

  showError(message: string, title: string = 'Error') {
    this.toastSubject.next({ type: 'error', title, message, id: ++this.counter });
  }

  showInfo(message: string, title: string = 'Información') {
    this.toastSubject.next({ type: 'info', title, message, id: ++this.counter });
  }

  showWarning(message: string, title: string = 'Advertencia') {
    this.toastSubject.next({ type: 'warning', title, message, id: ++this.counter });
  }
}
