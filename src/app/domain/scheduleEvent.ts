import { CalendarEvent } from 'angular-calendar';

export class ScheduleEvent implements CalendarEvent {
    id?: string | number;    
    start: Date;
    end?: Date;
    title: string;
    color?: import("calendar-utils").EventColor;
    actions?: import("calendar-utils").EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: { beforeStart?: boolean; afterEnd?: boolean; };
    draggable?: boolean;
    meta?: any;

    taken: boolean;
    totalUnits: number;
    unitTaken: number;
    scheduleId: string;
}