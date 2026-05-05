export enum ChatStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface Chat {
  id: string;
  fanId: string;
  celebrityId: string;
  bookingId?: string;
  telegramUsername: string;
  status: ChatStatus;
  createdAt: Date;
  updatedAt: Date;
}
