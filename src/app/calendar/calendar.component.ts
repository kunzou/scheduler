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
import { Appointment } from '../domain/appointment';

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
  @Input() reload: Subject<boolean> = new Subject<boolean>();
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

  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestMessage: string;
  // guestConsent: boolean;  

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
    this.reload.subscribe(reload => {
      if(reload) {
        this.getEvents();
      }
    })
  }

  getEvents() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventService.getCalendarEventsByScheduleId(id).subscribe((res:ScheduleEventsResponse) => {
      this.dayStartHour = parseInt(res.dayStartHour.toString().split(":")[0], 10);
      this.dayEndHour = parseInt(res.dayEndHour.toString().split(":")[0], 10);
      this.events =[];
      res.scheduleEvents.forEach(event => {
        if(event.available > 0) {
          event.color = colors.blue;
        } else {
          event.color = colors.red;
        }
        
        event.start = new Date(event.start);
        event.end = new Date(event.end);
        event.title = 'Available: ' + event.available;
        this.events.push(event);
      })

      this.refresh.next();
    });
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }  

  handleEvent(action: string, event: ScheduleEvent): void {
    if(event.available > 0) {
      this.reservationResponse = null;
      this.showReserveButton = event.available > 0;
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  makeReservation(event: ScheduleEvent) {
    this.eventService.addReservation({
      scheduleId: this.route.snapshot.paramMap.get('id'),
      start: event.start,
      end: event.end,
      guestFirstName: this.guestFirstName,
      guestLastName: this.guestLastName,
      guestEmail: this.guestEmail,
      guestMessage: this.guestMessage  
    } as Appointment).subscribe(
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