export class Schedule {
    id: string
    userId: string
    name: string
    eventInterval: Date
    openHour: Date
    closeHour: Date
    maxAllowedDaysFromNow: number
    availability: number    
}