export interface FanReview {
  id: string;
  fanId: string;
  celebrityId: string;
  bookingId?: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
