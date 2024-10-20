import { Component, ViewChild, ElementRef,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RasaResponse {
  text: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule,CommonModule, PanelModule, InputTextareaModule, ButtonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild('chatContent', { static: false }) chatContent!: ElementRef;



  sendGreetMessage() {
    this.sendToRasa('/greet').subscribe(response => {
      response.forEach((msg) => {
        this.messages.push({ sender: 'ai', text: msg.text });
      });
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    });
  }

  private rasaUrl = 'http://localhost:5005/webhooks/rest/webhook'; 

  userInput: string = '';
  messages: Array<{ sender: string, text: string }> = [];
  isTyping = false;

  constructor(private http: HttpClient) {
    this.sendGreetMessage();
  }

  sendMessage() {
    if (this.userInput.trim()) {
      const userMessage = this.userInput;
      this.messages.push({ sender: 'user', text: userMessage });
      this.isTyping = true;

      this.sendToRasa(userMessage).subscribe(response => {
        this.isTyping = false;
        response.forEach((msg) => {
          this.messages.push({ sender: 'ai', text: msg.text });
        });
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
        
      });
      
      this.userInput = '';
      this.scrollToBottom();
    }
  }

  sendToRasa(message: string): Observable<RasaResponse[]> {
    return this.http.post<RasaResponse[]>(this.rasaUrl, { sender: 'user', message });
  }  

  scrollToBottom() {
    const chatContentElement = this.chatContent.nativeElement;
    chatContentElement.scrollTop = chatContentElement.scrollHeight;
  }

  closeChat() {
    console.log('Chat closed');
  }
}
