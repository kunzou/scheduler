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
  constructor(
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
  }





}
