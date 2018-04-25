import { UUID } from 'angular2-uuid';

export interface PendingCheckin {
    id: string, //UUID
    date: Date,
    in: boolean,
    location: {
        id: number,
        description: string,
        area: {
            description: string
        }
    }
    activity: {
        id: number,
        description: string
    },
    position?: {lat: number, lon: number} | null
}
