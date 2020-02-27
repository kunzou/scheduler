import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  Input
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
  reservationResponse: string;
  responseType: any;

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
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.reservationResponse = null);       
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
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    // this.events = [
    //   ...this.events,
    //   {
    //     title: 'New event',
    //     start: startOfDay(new Date()),
    //     end: endOfDay(new Date()),
    //     color: colors.red,
    //     draggable: false,
    //     resizable: {
    //       beforeStart: true,
    //       afterEnd: true
    //     }
    //   }
    // ];
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  makeReservation(event: ScheduleEvent) {
    this.eventService.addReservation(event).subscribe(
      (response) => {
        this.responseType = "success";
        this.reservationResponse = "DONE";
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
  }   

  // closeOpenMonthViewDay() {
  //   this.activeDayIsOpen = false;
  // }
}

  // = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: false
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: false
  //   }
  // ];

  // activeDayIsOpen: boolean = true;


  // actions: EventAction[] = [
  //   {
  //     label: '<i class="fa fa-fw fa-pencil"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: Event }): void => {
  //       this.handleEvent('Edited', event);
  //     }
  //   },
  //   {
  //     label: '<i class="fa fa-fw fa-times"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: Event }): void => {
  //       this.events = this.events.filter(iEvent => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     }
  //   }
  // ];


  // dayClicked({ date, events }: { date: Date; events: Event[] }): void {
  //   if (isSameMonth(date, this.viewDate)) {
  //     if (
  //       (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
  //       events.length === 0
  //     ) {
  //       this.activeDayIsOpen = false;
  //     } else {
  //       this.activeDayIsOpen = true;
  //     }
  //     this.viewDate = date;
  //   }
  // }

  // eventTimesChanged({
  //   event,
  //   newStart,
  //   newEnd
  // }: EventTimesChangedEvent): void {
  //   this.events = this.events.map(iEvent => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd
  //       };
  //     }
  //     return iEvent;
  //   });
  //   this.handleEvent('Dropped or resized', event);
  // }


  // deleteEvent(eventToDelete: Event) {
  //   this.events = this.events.filter(event => event !== eventToDelete);
  // }  