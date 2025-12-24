import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastMessage } from '../../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription!: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.toast$.subscribe((toast: ToastMessage) => {
      this.toasts.push(toast);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        this.removeToast(toast.id!);
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'pi-check-circle';
      case 'error': return 'pi-exclamation-circle';
      case 'warning': return 'pi-exclamation-triangle';
      default: return 'pi-info-circle';
    }
  }

  getBgClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-500/90 text-white border-green-400';
      case 'error': return 'bg-red-500/90 text-white border-red-400';
      case 'warning': return 'bg-amber-500/90 text-white border-amber-400';
      default: return 'bg-blue-500/90 text-white border-blue-400';
    }
  }
}
