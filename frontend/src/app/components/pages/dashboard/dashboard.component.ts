import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { INotification, IUser } from '../../../utils/models';
import { DatePipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { PublicationsService } from '../../../services/publications.service';
import { NotificationsService } from '../../../services/notifications.service';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PublicationComposerComponent } from '../../composer/publication-composer/publication-composer.component';
import { TableauComposerComponent } from '../../composer/tableau-composer/tableau-composer.component';
import { MessageComposerComponent } from '../../composer/message-composer/message-composer.component';  

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, SlicePipe ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements OnInit {
  user: IUser | null = null;
  totalUsers: number = 0;
  publicationStats: Record<string, number> = {};
  recentPublications: any[] = []; // To hold the last 5 publications
  recentNotifications: INotification[] = []; // To hold the last 5 notifications
  totalNotifications: number = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private pubs: PublicationsService,
    private nots: NotificationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Get logged-in user info
    this.user = this.authService.getCurrentUser();
    console.log('user ', this.user);

    // Get total number of users
    this.userService.getUserCount().subscribe(count => {
      this.totalUsers = count;
    });

    // Get publication stats
    this.pubs.getPublicationsCountByType().subscribe(stats => {
      this.publicationStats = stats;
    });
    // Get the last 5 publications
    this.pubs.getPublications().subscribe(data => {
      this.recentPublications = data;
      console.log('Publications reçues:', data);
    });
    // Get the last 5 notifications
    this.nots.listNotifications().subscribe(data  => {
      this.recentNotifications = data.notifications;
      this.totalNotifications = data.count;
      console.log('Total notifications:', this.totalNotifications);
      console.log('Notifications reçues:', data);
    });

  }
   openCreatePublicationDialog(): void {
    const dialogRef = this.dialog.open(PublicationComposerComponent, {
      width: '600px', // or 80%, 500px, etc.
      disableClose: true, // Prevent click-outside to close
      panelClass: 'pub-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Optionally reload publications after creation
      this.ngOnInit();
    });
  }
  openCreateTableauDialog(): void {
    const dialogRef = this.dialog.open(TableauComposerComponent, {
      width: '600px', // or 80%, 500px, etc.
      disableClose: true, // Prevent click-outside to close
      panelClass: 'tab-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      // Optionally reload tableaux after creation
      this.ngOnInit();
    });
  }
  openCreateMessageDialog(): void {
    const dialogRef = this.dialog.open(MessageComposerComponent, {
      width: '600px', // or 80%, 500px, etc.
      disableClose: true, // Prevent click-outside to close
      panelClass: 'msg-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      // Optionally reload messages after creation
      this.ngOnInit();
    });
  }
}
