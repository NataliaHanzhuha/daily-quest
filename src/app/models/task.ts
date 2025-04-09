export interface VenueCategory {
  id: string | null;
  title: string;
  description: string;
  imageUrl?: string | null;
}

export interface Dropdown {
  label: string;
  value: string | null;
}

export interface Venue {
  id: string | null;
  categoryId: string | null;
  categoryName: string | null;
  title: string;
  description: string;
  imageUrl?: string | null;
  capacity: number; // max number of people
  hourlyRate: number;
  amenities: string[]; // list of amenities
  minHours: number; // minimum booking duration
  maxHours: number; // maximum booking duration
  color: string;
  paddingBeforeMinutes: number;
  paddingAfterMinutes: number;
}

export interface EventBooking {
  id: string;
  venueId: string;
  date: Date | string;
  dateString?: string; // YYYY-MM-DD format for Firebase querying
  startTime: string; // in 24-hour format "HH:MM"
  endTime: string; // in 24-hour format "HH:MM"
  duration: number; // in hours
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerId?: string;
  customerPhoneNumberPrefix: string;
  eventType: string; // e.g., "Wedding", "Corporate", "Birthday"
  attendees: number; // number of expected guests
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  totalAmount: number;
  paymentDetails?: PaymentDetails;
  addToGoogleCalendar: boolean;
  userId: string;
  createdAt?: Date | string;
}

export interface PaymentDetails {
  paymentId?: string;
  requestDate?: Date | string;
  paymentDate?: Date | string;
  collectedBy?: string;
  notes?: string;
  paymentStatus?: PaymentStatus;
  paymentType?: Payment;
}

export type Payment = 'online' | 'local' | 'other';

export enum PaymentStatus {
  unpaid = 'unpaid',
  pending = 'pending',
  paid = 'paid',
}

export interface WorkSchedule {
  id: string;
  date: WeekDay;
  startTime: string;
  endTime: string;
  // description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export enum WeekDay {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export interface Customer {
  fullName: string;
  email: string;
  phone: string;
  price: number;
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
}
