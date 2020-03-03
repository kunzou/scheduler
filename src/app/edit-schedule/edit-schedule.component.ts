import { Component, OnInit } from '@angular/core';
import { Schedule } from '../domain/schedule';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';

import { ScheduleService } from '../service/schedule.service';

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
  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getSchedule();
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

  back() {
    this.location.back();
  }
}
