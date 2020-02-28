export class Schedule {
    id: string
    userId: string
    name: string
    eventInterval: Date
    openTime: Date
    closeTime: Date
    maxAllowedDaysFromNow: number
    availability: number    
}