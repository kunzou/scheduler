import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ScheduleService } from 'src/app/service/schedule.service';
import { Schedule } from 'src/app/domain/schedule';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  schedules: Schedule[];
  constructor(
    public auth: AuthService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {  }

  ngOnInit(): void {
    this.getSchedules();
  }

  add(): void {
    this.scheduleService.createSchedule({userId: this.auth.userId} as Schedule)
      .subscribe(schedule => {
        this.router.navigate(['/edit', schedule.id]);
      })
  }

  getSchedules() {
    this.scheduleService.getSchedulesByUserId(this.auth.userId).subscribe(schedules => {
      this.schedules = schedules
    });
  }

}
