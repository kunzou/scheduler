import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ScheduleService } from '../service/schedule.service';
import { Schedule } from '../domain/schedule';
import { Router } from '@angular/router';
import { share } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  schedules: Schedule[];
  userid: string;

  constructor(
    public auth: AuthService,
    private scheduleService: ScheduleService,  
    private router: Router
  ) { }

  ngOnInit(): void {
    this.auth.userid$.subscribe(userid=>{
      this.userid = userid;
      this.scheduleService.getSchedulesByUserId(userid).subscribe(schedules => {
        this.schedules = schedules
      })      
    })
  }
  
  add(): void {
    this.scheduleService.createSchedule({userId: this.userid} as Schedule)
      .subscribe(schedule => {
        this.router.navigate(['/edit', schedule.id]);
      })
  }  

}
