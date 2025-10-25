export interface Ride {
    id?: number;
    driverName: string;
    phoneNumber: string;
    seatsAvailable: number;
    travelTime: 'morning' | 'evening';
    latitude: number;
    longitude: number;
    createdAt?: Date;
}
