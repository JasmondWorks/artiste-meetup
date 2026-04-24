export enum CelebrityCategory {
  MUSIC_ARTISTE = "MUSIC_ARTISTE",
  FILM_ACTOR = "FILM_ACTOR",
  PROFESSIONAL_ATHLETE = "PROFESSIONAL_ATHLETE",
  TECH_ENTREPRENEUR = "TECH_ENTREPRENEUR",
}

export enum CelebrityStatus {
  AVAILABLE = "AVAILABLE",
  LIMITED = "LIMITED",
  UNAVAILABLE = "UNAVAILABLE",
}

export enum CelebrityApprovalStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export interface Celebrity {
  id: string;
  name: string;
  profession: string;
  category: CelebrityCategory;
  userId: string | null;
  status: CelebrityStatus;
  approvalStatus: CelebrityApprovalStatus;
  rejectionReason: string | null;
  bio: string;
  bookingPrice: number;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}
