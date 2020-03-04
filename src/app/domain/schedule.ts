export class Schedule {
    id: string
    userId: string
    name: string
    eventInterval: number
    openHour: Date
    closeHour: Date
    maxAllowedDaysFromNow: number
    availability: number    
    userEmail: string
}