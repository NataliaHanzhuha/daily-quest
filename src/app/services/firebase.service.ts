import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Customer, EventBooking, Venue, VenueCategory, WorkSchedule } from '../models/task';
import { NzMessageService } from 'ng-zorro-antd/message';
import { serverTimestamp } from '@angular/fire/database';
import { EmailService } from './email.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  readonly currencySymbol: string = '₦';
  private readonly COLLECTION_NAME = 'work-schedules';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private message: NzMessageService,
    private emailService: EmailService,
  ) {
  }

  // ====== Categories ======

  getCategories(): Observable<VenueCategory[]> {
    return this.firestore.collection<VenueCategory>('venueCategories').valueChanges({idField: 'id'})
      .pipe(catchError(error => {
        console.error('Error loading categories:', error);
        this.message.error('Failed to load categories');
        return of([]);
      }));
  }

  getCategoryById(id: string): Observable<VenueCategory | undefined> {
    return this.firestore.doc<VenueCategory>(`venueCategories/${id}`).valueChanges();
  }

  addCategory(category: Omit<VenueCategory, 'id'>): Observable<VenueCategory> {
    const id = this.firestore.createId();
    const newCategory: VenueCategory = {...category, id};

    return from(this.firestore.doc(`venueCategories/${id}`).set(newCategory))
      .pipe(catchError(error => {
          console.error('Error adding category:', error);
          this.message.error('Failed to add category');
          return of(null);
        }),
        map(() => newCategory));
  }

  updateCategory(category: VenueCategory): Observable<VenueCategory> {
    return from(this.firestore.doc(`venueCategories/${category.id}`).update(category))
      .pipe(
        catchError((error) => {
          console.error('Error updating category:', error);
          this.message.error('Failed to update category');
          return of(null);
        }),
        map(() => category));
  }

  deleteCategory(id: string): Observable<boolean> {
    return from(this.firestore.doc(`venueCategories/${id}`).delete())
      .pipe(
        switchMap(() => this.getVenuesByCategory(id)),
        switchMap(venues => {
          const updations = venues.map(venue => this.updateVenue({...venue, categoryId: null}));
          return updations.length > 0 ? forkJoin(updations) : of([]);
        }),
        map(() => true),
        catchError(error => {
          console.error('Error deleting category:', error);
          return of(false);
        })
      );
  }

  uploadCategoryImage(file: File): Observable<string> {
    const filePath = `category-images/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return from(task).pipe(
      switchMap(() => fileRef.getDownloadURL())
    );
  }

  // ====== Customers =======

  getAllCustomers(): Observable<Customer[]> {
    return this.firestore.collection<Customer>('customers').valueChanges({idField: 'id'})
      .pipe(catchError((err) => {
        this.message.error('Failed to load customers');
        console.error('Error loading customers:', err);
        return of([]);
      }));
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    return this.firestore.doc<Customer>(`customers/${id}`).valueChanges();
  }

  getCustomersByEmailAndPhone(email: string, phone: string): Observable<Customer[]> {
    return this.firestore.collection<Customer>('customers', ref =>
      ref.where('email', '==', email).where('phone', '==', phone)
    ).valueChanges();
  }

  // createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
  //   const id = this.firestore.createId();
  //   const newCustomer: Customer = {...customer, id};
  //
  //   return from(this.firestore.doc(`customers/${id}`).set(newCustomer))
  //     .pipe(catchError(error => {
  //         console.error('Error adding customer:', error);
  //         this.message.error('Failed to add customer');
  //         return of(null);
  //       }),
  //       map(() => newCustomer));
  // }

  // updateCustomer(customer: Customer): Observable<Customer> {
  //   return from(this.firestore.doc(`customers/${customer.id}`).update(customer))
  //     .pipe(
  //       catchError((error) => {
  //         console.error('Error updating customer:', error);
  //         this.message.error('Failed to update customer');
  //         return of(null);
  //       }),
  //       map(() => customer));
  // }

  deleteCustomer(id: string): Observable<boolean> {
    return from(this.firestore.doc(`customers/${id}`).delete())
      .pipe(
        map(() => true),
        catchError(error => {
          this.message.error('Failed to delete customers');
          console.error('Error deleting customers:', error);
          return of(false);
        })
      );
  }

  // ====== Payments =====



  // ====== Venues ======

  getVenues(): Observable<Venue[]> {
    return this.firestore.collection<Venue>('venues').valueChanges({idField: 'id'})
      .pipe(catchError((err) => {
        this.message.error('Failed to load venues');
        console.error('Error loading venues:', err);
        return of([]);
      }));
  }

  getVenuesByCategory(categoryId: string): Observable<Venue[]> {
    return this.firestore.collection<Venue>('venues', ref =>
      ref.where('categoryId', '==', categoryId)
    ).valueChanges({idField: 'id'});
  }

  getVenueById(id: string): Observable<Venue | undefined> {
    return this.firestore.doc<Venue>(`venues/${id}`).valueChanges();
  }

  addVenue(venue: Omit<Venue, 'id'>): Observable<Venue> {
    const id = this.firestore.createId();
    const newVenue: Venue = {...venue, id};

    return from(this.firestore.doc(`venues/${id}`).set(newVenue))
      .pipe(catchError((err) => {
        this.message.error('Failed to add venue');
        console.error('Error adding venue:', err);
        return of(null);
      }), map(() => newVenue));
  }

  updateVenue(venue: Venue): Observable<Venue> {
    return from(this.firestore.doc(`venues/${venue.id}`).update(venue))
      .pipe(
        catchError((err) => {
          this.message.error('Failed to update venue');
          console.error('Error updating venue:', err);
          return of(null);
        }),
        map(() => venue));
  }

  deleteVenue(id: string): Observable<boolean> {
    return from(this.firestore.doc(`venues/${id}`).delete())
      .pipe(
        map(() => true),
        catchError(error => {
          this.message.error('Failed to delete venue');
          console.error('Error deleting venue:', error);
          return of(false);
        })
      );
  }

  uploadVenueImage(file: File): Observable<string> {
    const filePath = `venue-images/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return from(task).pipe(
      switchMap(() => fileRef.getDownloadURL())
    );
  }

  // ====== Bookings ======

  getBookings(): Observable<EventBooking[]> {
    return this.firestore.collection<EventBooking>('bookings', ref =>
      ref.orderBy('date', 'desc')
    ).valueChanges({idField: 'id'})
      .pipe(catchError(err => {
          console.error('Error loading bookings:', err);
          this.message.error('Failed to load bookings');

          return of([]);
        }),
        map((bookings: EventBooking[]) => {
          return bookings.map((booking: EventBooking) => {
            return {
              ...booking,
              date: this.normalizeFirebaseTimestamp(booking.date),
              createdAt: this.normalizeFirebaseTimestamp(booking.createdAt)
            };
          });
        }));
  }

  getUserBookings(userId: string): Observable<EventBooking[]> {
    return this.firestore.collection<EventBooking>('bookings', ref =>
      ref.where('userId', '==', userId).orderBy('date', 'desc')
    ).valueChanges({idField: 'id'});
  }

  getBookingById(id: string): Observable<EventBooking | undefined> {
    return this.firestore.doc<EventBooking>(`bookings/${id}`)
      .valueChanges()
      // @ts-ignore
      .pipe(catchError((err: any): Observable<EventBooking | undefined> => {
          console.error('Error loading bookings:', err);
          this.message.error('Failed to load bookings');

          return of(undefined);
        }),
        map((booking: EventBooking): any => {
          if (!booking) {
            return null;
          }
          return {
            ...booking,
            date: this.normalizeFirebaseTimestamp(booking.date),
            createdAt: this.normalizeFirebaseTimestamp(booking.createdAt)
          };
        })
      );
  }

  getBookingsByVenueAndDate(venueId: string, date: Date): Observable<EventBooking[]> {
    // Firebase needs dates compared as strings in format YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];

    return this.firestore.collection<EventBooking>('bookings', ref =>
      ref.where('venueId', '==', venueId)
        .where('dateString', '==', dateString)
        .where('status', '!=', 'cancelled')
    ).valueChanges({idField: 'id'});
  }

  createBooking(booking: Omit<EventBooking, 'id'>, venueName: string): Observable<EventBooking> {
    const id = this.firestore.createId();
    const dateString = (booking.date as Date).toISOString().split('T')[0];
    const newBooking: EventBooking = {
      ...booking,
      id,
      dateString // Add this field for easier querying
    };

    return from(this.firestore.doc(`bookings/${id}`).set(booking))
          .pipe(
            switchMap((booking: any) => {
              if(booking.id) {
                return this.emailService.sendEmailAfterAppointmentCreated(booking, venueName)
                  .pipe(map(() => newBooking))
              } else {
                return of(null);
              }
            }),
            map(() => newBooking));
  }

  updateBooking(booking: EventBooking): Observable<EventBooking> {
    console.log(booking);
    // Ensure dateString is set for querying
    const updatedBooking = {
      ...booking,
      dateString: typeof booking.date === 'string'
        ? new Date(booking.date)?.toISOString().split('T')[0]
        : booking.date.toISOString().split('T')[0]
    };

    return from(this.firestore.doc(`bookings/${booking.id}`).update(updatedBooking))
      .pipe(map(() => updatedBooking));
  }

  updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'paid' | 'cancelled'): Observable<boolean> {
    return from(this.firestore.doc(`bookings/${bookingId}`).update({status}))
      .pipe(
        map(() => true),
        catchError(error => {
          console.error('Error updating booking status:', error);
          return of(false);
        })
      );
  }

  updatePaymentStatus(bookingId: string, paymentStatus: 'unpaid' | 'partial' | 'paid', paymentId?: string): Observable<boolean> {
    const update: any = {paymentStatus};

    if (paymentStatus === 'paid') {
      update.status = 'paid';
    }

    if (paymentId) {
      update.paymentId = paymentId;
    }

    return from(this.firestore.doc(`bookings/${bookingId}`).update(update))
      .pipe(
        map(() => true),
        catchError(error => {
          console.error('Error updating payment status:', error);
          return of(false);
        })
      );
  }

  // ====== Schedules ======

  getSchedules(): Observable<WorkSchedule[]> {
    return this.firestore.collection<WorkSchedule>(this.COLLECTION_NAME, ref =>
      ref.orderBy('date', 'desc')).valueChanges()
      .pipe(
        catchError((err) => {
          this.message.error('Failed to load schedules');
          console.error(err);
          return of([]);
        }),
      );
  }

  // Add a new schedule
  addSchedule(schedule: Omit<WorkSchedule, 'id'>): Observable<WorkSchedule> {
    const id = this.firestore.createId();
    const scheduleWithTimestamps = {
      ...schedule,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      id
    } as WorkSchedule;

    return from(this.firestore.doc(`${this.COLLECTION_NAME}/${id}`).set(scheduleWithTimestamps))
      .pipe(catchError((err) => {
          this.message.error('Failed to add schedule');
          console.error(err);

          return of(null);
        }),
        map(() => scheduleWithTimestamps));
  }

  // Update a schedule
  updateSchedule(schedule: Partial<WorkSchedule>): Observable<WorkSchedule> {
    const updatedBooking = {
      ...schedule,
      updatedAt: serverTimestamp()
    } as WorkSchedule;

    return from(this.firestore.doc(`${this.COLLECTION_NAME}/${schedule.id}`).update(updatedBooking))
      .pipe(catchError((err) => {
          this.message.error('Failed to update schedule');
          console.error(err);

          return of(null);
        }),
        map(() => updatedBooking));
  }

  // Delete a schedule
  deleteSchedule(id: string): Observable<boolean> {
    return from(this.firestore.doc(`${this.COLLECTION_NAME}/${id}`).delete())
      .pipe(
        map(() => true),
        catchError(error => {
          this.message.error('Failed to delete of scheduled day');
          console.error('Error deleting of scheduled day:', error);
          return of(false);
        })
      );
  }

  // Add to Google Calendar (in a real app, this would use the Google Calendar API)
  addToGoogleCalendar(bookingId: string): Observable<boolean> {
    return this.getBookingById(bookingId).pipe(
      switchMap(booking => {
        if (!booking) {
          return of(false);
        }

        // In a real implementation, this would create a Google Calendar event
        // For this example, we'll just mark it as added in the booking record
        const updatedBooking = {
          ...booking,
          addToGoogleCalendar: true
        };

        return this.updateBooking(updatedBooking).pipe(map(() => true));
      })
    );
  }


  // Calculate total cost for an event
  calculateEventCost(venueId: string, duration: number): Observable<number> {
    return this.getVenueById(venueId).pipe(
      map(venue => {
        if (!venue) {
          return 0;
        }
        return venue.hourlyRate * duration;
      })
    );
  }

  // Check if venue is available at specific date and time
  checkVenueAvailability(venueId: string, date: Date): Observable<EventBooking[]> {
    return this.getBookingsByVenueAndDate(venueId, date).pipe(
      map(bookings => {
        const conflictingBookings = bookings.filter(booking =>
            booking.status !== 'cancelled'
          // && this.isTimeOverlap(booking.startTime, booking.endTime, startTime, endTime)
        );

        console.log(conflictingBookings);
        return conflictingBookings;
      })
    );
  }

  private normalizeFirebaseTimestamp(firebaseTimestamp: any): string {
    if (Object.prototype.toString.call(firebaseTimestamp) === '[object Date]') {
      return firebaseTimestamp.toISOString();
    }

    if (typeof firebaseTimestamp === 'string') {
      return firebaseTimestamp;
    }

    const {seconds, nanoseconds} = firebaseTimestamp;
    const milliseconds = seconds * 1000 + nanoseconds / 1e6; // Convert to ms
    return new Date(milliseconds)?.toISOString(); // Convert to ISO format
  }
}

