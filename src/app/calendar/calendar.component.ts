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
  addHours,
  max
} from 'date-fns';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

import { EventService } from 'src/app/service/event.service';
import { ScheduleEvent } from 'src/app/domain/scheduleEvent';
import { ActivatedRoute } from '@angular/router';
import { ScheduleEventsResponse } from '../domain/scheduleEventsResponse';

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
  refresh: Subject<any> = new Subject();
  reservationResponse: string;
  responseType: any;
  showReserveButton: boolean;
  dayStartHour: number;
  dayEndHour: number;

  modalData: {
    action: string;
    event: ScheduleEvent;
  };

  events: ScheduleEvent[];
  scheduleId: string;

  constructor(
    private modal: NgbModal,
    private eventService: EventService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.getEvents();
    this.refresh.next();

    this._success.subscribe((message) => this.reservationResponse = message);
    this._showButton.subscribe((showButton) => this.showReserveButton = showButton);     
  }

  getEvents() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventService.getCalendarEventsByScheduleId(id).subscribe((res:ScheduleEventsResponse) => {
      this.dayStartHour = parseInt(res.dayStartHour.toString().split(":")[0], 10);
      this.dayEndHour = parseInt(res.dayEndHour.toString().split(":")[0], 10);
      this.events =[];
      res.scheduleEvents.forEach(event => {
        if(event.unitTaken == 0) {
          event.color = colors.blue;
        } else if(event.unitTaken < event.totalUnits) {
          event.color = colors.yellow;
        } else {
          event.color = colors.red;
        }
        
        event.start = new Date(event.start);
        event.end = new Date(event.end);
        this.events.push(event);
      })

      // this.dayStartHour = events[0].start.getHours()-1;
      // this.dayStartHour = events.map(event=>event.start.getHours()).reduce(hour=>Math.max(hour));

      // this.dayEndHour = events.slice(-1)[0].end.getHours();
      this.refresh.next();
    });
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
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
    event.scheduleId = this.route.snapshot.paramMap.get('id');
    this.eventService.addReservation(event).subscribe(
      (response) => {
        this.responseType = "success";
        this.reservationResponse = "DONE";
        this.showReserveButton = false;
        this.getEvents();
        this.showMessage();
      },
      (error) => {
        this.responseType = "danger";
        this.reservationResponse = "OOPS";
        this.getEvents();
        this.showMessage();
      }
    );    
  }

  showMessage() {
    this._success.next(this.reservationResponse);
    this._showButton.next(this.showReserveButton);
  }   
}