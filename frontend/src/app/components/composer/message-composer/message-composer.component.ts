import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import {IMessage, IUser } from '../../../utils/models';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
    // adjust path

@Component({
  selector: 'app-message-composer',
  imports: [CommonModule, FormsModule],
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.css']
})
export class MessageComposerComponent {
  message: Partial<IMessage> = {
    titre: '',
    contenu: '',
    departement: '',
    statut: 'à venir',
    dateDebut: '',
    dateFin: '',
  };

  constructor(private http: HttpClient) {}

  submitMessage() {
    // Optional: Validate required fields here
    if (!this.message.titre || !this.message.contenu) {
      alert('Please fill in both title and content.');
      return;
    }

    if (this.message.dateDebut && this.message.dateFin) {
    if (this.message.dateFin < this.message.dateDebut) {
      alert('End date/time cannot be before start date/time.');
      return;
    }
  }

    // POST the message data to backend API
    this.http.post<IMessage>('http://localhost:3000/api/messages', this.message)
      .subscribe({
        next: (res) => {
          console.log('Message created:', res);
          alert('Message sent successfully!');
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating message:', err);
          alert('Failed to send message.');
        }
      });
  }

  resetForm() {
    this.message = {
      titre: '',
      contenu: '',
      departement: ''
    };
  }
}
