import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  Input,
  ElementRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

import { EventService } from '../event.service';
import { ScheduleEvent } from '../domain/scheduleEvent';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @Input() public alerts: Array<string> = [];
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  viewDate: Date = new Date();
  private _success = new Subject<string>();
  private _showButton = new Subject<boolean>();
  reservationResponse: string;
  responseType: any;
  showReserveButton: boolean;

  modalData: {
    action: string;
    event: ScheduleEvent;
  };

  refresh: Subject<any> = new Subject();

  events: ScheduleEvent[];

  constructor(
    private modal: NgbModal,
    private eventService: EventService,
    alertConfig: NgbAlertConfig
  ) {
    alertConfig.dismissible = false;
  }

  ngOnInit() {
    this.getDummy();

    this._success.subscribe((message) => this.reservationResponse = message);
    this._showButton.subscribe((showButton) => this.showReserveButton = showButton);
    // this._success.pipe(
    //   debounceTime(5000)
    // ).subscribe(() => this.reservationResponse = null);       
  }

  getDummy(): void {
    this.eventService.getDummyCalendarEvents().subscribe(events => {
      this.events = events;
      this.events.forEach(event => {
        if(event.unitTaken == 0) {
          event.color = colors.blue;
        } else if(event.unitTaken < event.totalUnits) {
          event.color = colors.yellow;
        } else {
          event.color = colors.red;
        }
        
        event.start = new Date(event.start);
        event.end = new Date(event.end);
      })
    });
  }    

  changeDay(date: Date) {
    // this.viewDate = date;
    this.view = CalendarView.Week;
  }  

  handleEvent(action: string, event: ScheduleEvent): void {
    this.reservationResponse = null;
    this.showReserveButton = event.unitTaken < event.totalUnits;
    this.modalData = { event, action };event.start.getTime
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  makeReservation(event: ScheduleEvent) {
    this.eventService.addReservation(event).subscribe(
      (response) => {
        this.responseType = "success";
        this.reservationResponse = "DONE";
        this.showReserveButton = false;
        this.getDummy();
        this.showMessage();
      },
      (error) => {
        this.responseType = "danger";
        this.reservationResponse = "OOPS";
        this.getDummy();
        this.showMessage();
      }
    );    
  }

  showMessage() {
    this._success.next(this.reservationResponse);
    this._showButton.next(this.showReserveButton);
  }   
}