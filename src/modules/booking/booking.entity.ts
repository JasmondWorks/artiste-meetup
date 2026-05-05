export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export interface Booking {
  id: string;
  fanId: string;
  celebrityId: string;
  timeSessionId: string;
  message?: string;
  telegramUsername?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
