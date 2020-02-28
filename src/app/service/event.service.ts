import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { ScheduleEvent } from 'src/app/domain/scheduleEvent';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = environment.baseUrl + '/events';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',  observe: 'response', responseType: 'text'})
  };
 
  constructor(
    private http: HttpClient
  ) { }

  getDummyCalendarEvents(): Observable<ScheduleEvent[]> {
    return this.http.get<ScheduleEvent[]>(this.baseUrl);
  }

  addReservation(calendarEvent: ScheduleEvent): Observable<any> {
    return this.http.post<ScheduleEvent>(this.baseUrl, calendarEvent, {observe: 'response', });
  }
}
