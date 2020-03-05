import { Injectable } from '@angular/core';
import { Schedule } from 'src/app/domain/schedule';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private baseUrl = environment.baseUrl + '/schedule';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',  observe: 'response'})
  };
  constructor(
    private http: HttpClient
  ) { }

  createSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(this.baseUrl, schedule, this.httpOptions);
  }

  getSchedulesByUserId(userId: string): Observable<Schedule[]> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.get<Schedule[]>(url);
  }  

  getScheduleById(id: string): Observable<Schedule> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Schedule>(url);
  }    

  save(schedule: Schedule): Observable<any> {
    return this.http.post<Schedule>(this.baseUrl, schedule, {observe: 'response'});
  }  

  delete(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Schedule>(url, this.httpOptions);
  }

}
