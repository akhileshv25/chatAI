import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RasaResponse {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class RasaService {
  private rasaUrl = 'http://localhost:5005/webhooks/rest/webhook'; // Adjust if needed

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<RasaResponse[]> {
    return this.http.post<RasaResponse[]>(this.rasaUrl, { sender: 'user', message });
  }
}
