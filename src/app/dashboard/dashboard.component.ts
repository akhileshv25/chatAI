import { Component, ViewChild, ElementRef,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RasaResponse {
  text: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule,CommonModule, PanelModule, InputTextareaModule, ButtonModule, FormsModule ,ReactiveFormsModule, InputTextareaModule],
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
  userId = 1;
  constructor(private http: HttpClient) {
   // this.sendGreetMessage();
   // this.fetchMessages();
   this.messages.push({ sender: 'ai', text: "Hello! How can I assist you today?" });
  }

  fetchMessages() {
    const url = `http://localhost:8080/api/messages/user/${this.userId}`;
    this.http.get<any[]>(url).subscribe(response => {
      this.messages = response.map(msg => ({
        sender: msg.senderType,
        text: msg.content
      }));
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    }, error => {
      console.error('Failed to fetch messages:', error);
    });
  }
  

  sendMessage() {
    if (this.userInput.trim()) {
      const userMessage = this.userInput;
      this.messages.push({ sender: 'user', text: userMessage });
      this.isTyping = true;
     // this.storeChat('user', userMessage);
      this.sendToRasa(userMessage).subscribe(response => {
        this.isTyping = false;
        response.forEach((msg) => {
          this.messages.push({ sender: 'ai', text: msg.text });
        //  this.storeChat('ai', msg.text);
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

  storeChat(role: string, content: string) {
    const url = "http://localhost:8080/api/messages"; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    const messageObj = {
      user: {
        userId: 1 
      },
      content: content,
      senderType: role 
    };
  
    this.http.post(url, messageObj, { headers, responseType: 'text' }).subscribe(
      (response: any) => {
        console.log('Add Successful', response); 
      },
      (error: any) => {
        console.log('Add failed', error); 
      }
    );
  }  

  

  closeChat() {
    console.log('Chat closed');
  }
}
