import { Component, OnInit } from '@angular/core';
import { Schedule } from '../domain/schedule';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';

import { ScheduleService } from '../service/schedule.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.css']
})
export class EditScheduleComponent implements OnInit {
  schedule: Schedule;
  private _success = new Subject<string>();
  reloadCalendar: Subject<boolean> = new Subject<boolean>();
  responseType: string;
  submitMessage: string;
  email:string
  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private location: Location,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.getSchedule();
    this.auth.userEmail$.subscribe(email => {
      this.email = email
    })
    this._success.subscribe((message) => this.submitMessage = message);
  }

  getSchedule(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.scheduleService.getScheduleById(id)
      .subscribe(schedule => {
        this.schedule = schedule;
      });
  }

  save() {
    this.schedule.userEmail = this.email;
    this.scheduleService.save(this.schedule).subscribe(
      (response) => {
        this.responseType = "success";
        this.submitMessage = "Saved";
        this.showMessage();
        this.reloadCalendar.next(true);
      },
      (error) => {
        this.responseType = "danger";
        this.submitMessage = "OOPS";
        this.showMessage();
      }
    );
  }

  showMessage() {
    this._success.next("Saved!");
  }

  delete() {
    this.scheduleService.delete(this.route.snapshot.paramMap.get('id')).subscribe(()=>this.location.back());
  }

  back() {
    this.location.back();
  }
}
