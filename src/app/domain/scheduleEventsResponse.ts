import { ScheduleEvent } from './scheduleEvent';

export class ScheduleEventsResponse{
    name: String;
    dayStartHour: Date;
    dayEndHour: Date;
    scheduleEvents: ScheduleEvent[];
}