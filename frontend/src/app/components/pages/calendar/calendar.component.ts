import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // optional
import interactionPlugin from '@fullcalendar/interaction';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],  // register plugins here
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadScheduledMessages();
  }

  loadScheduledMessages() {
    this.messageService.getScheduledMessages().subscribe(messages => {
      console.log('Scheduled Messages:', messages);
      this.calendarOptions.events = messages.map(msg => ({
        id: msg._id,
        title: msg.titre,
        start: msg.dateDebut,
        end: msg.dateFin,
        allDay: true,
        extendedProps: {
          description: msg.contenu,
          statut: msg.statut,
        }
      }));
    });
  }

  handleEventClick(clickInfo: any) {
    alert(`Message: ${clickInfo.event.title}\nDescription: ${clickInfo.event.extendedProps.description}`);
  }
}
