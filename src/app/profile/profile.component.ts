import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ScheduleService } from '../service/schedule.service';
import { Schedule } from '../domain/schedule';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  schedules: Schedule[];
  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService,  
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSchedules();
  }

  getSchedules() {
    // if(this.auth.authenticated) {
      this.scheduleService.getSchedulesByUserId(this.authService.userid).subscribe(schedules => {
        this.schedules = schedules
      });
    // }
  }
  
  add(): void {
    this.scheduleService.createSchedule({userId: this.authService.userid} as Schedule)
      .subscribe(schedule => {
        this.router.navigate(['/edit', schedule.id]);
      })
  }  

}
