import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // optional
import interactionPlugin from '@fullcalendar/interaction';
import { MessageService } from '../../../services/message.service';
import { IMessage } from '../../../utils/models';
import { MatDialog } from '@angular/material/dialog';
import { MessageComposerComponent } from '../../composer/message-composer/message-composer.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],  
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(private messageService: MessageService, private dialog: MatDialog) {}

  closeDialog() {
    this.dialog.closeAll();
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

  ngOnInit(): void {
    this.loadAllMessages();
  }

  loadAllMessages() {
    this.messageService.getAllMessages().subscribe((messages: IMessage[]) => {
      this.calendarOptions.events = messages.map(msg => ({
        id: msg._id,
        title: msg.titre,
        start: msg.dateDebut,
        end: msg.dateFin,
        allDay: true,
        backgroundColor: this.getStatusColor(msg.statut),
        borderColor: this.getStatusColor(msg.statut),
        extendedProps: {
          description: msg.contenu,
          statut: msg.statut,
        }
      }));
    });
  }

  getStatusColor(status: IMessage['statut']): string {
    switch (status) {
      case 'programmée':
        return '#007bff'; // Blue
      case 'en cours':
        return '#ffc107'; // Yellow
      case 'terminée':
        return '#28a745'; // Green
      case 'à venir':
        return '#17a2b8'; // Teal
      case 'tache':
        return '#6f42c1'; // Purple
      default:
        return '#6c757d'; // Gray
    }
  }

  handleEventClick(clickInfo: any) {
    alert(`📌 ${clickInfo.event.title}\n📝 ${clickInfo.event.extendedProps.description}\n🟢 Statut: ${clickInfo.event.extendedProps.statut}`);
  }
}
