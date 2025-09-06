import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../services/notifications.service';
import { INotification } from '../../../utils/models';
import { AuthService } from '../../../services/auth.service'; // You must provide currentUser from somewhere
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notification.component.html',
  imports: [NgIf, NgFor, NgClass,DatePipe],
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: INotification[] = [];
  currentUser: any;
  loading = true;
  error: string | null = null;

  constructor(
    private notificationsService: NotificationsService,
    private authService: AuthService // Assuming you have a service to get user info
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser(); // Should return user with role
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationsService.listNotifications().subscribe({
      next: (res) => {
        this.notifications = res.notifications;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des notifications.';
        this.loading = false;
      }
    });
  }

  markAsRead(id: string): void {
    this.notificationsService.markAsRead(id).subscribe({
      next: (updatedNotif) => {
        const index = this.notifications.findIndex(n => n._id === id);
        if (index !== -1) {
          this.notifications[index].lu = true;
        }
      },
      error: () => {
        this.error = 'Impossible de marquer la notification comme lue.';
      }
    });
  }
}
