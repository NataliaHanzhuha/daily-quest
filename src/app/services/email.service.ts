import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventBooking } from '../models/task';
import { TimeService } from './time.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly url: string = 'http://localhost:4242/api/send-email';
  // private readonly url: string = 'https://acropolispark-server-7355351ddd0f.herokuapp.com/api/send-email';
  private readonly address: string = 'Plot No. 3872, E27, Apo District, Abuja, FCT 900110, Federal Capital Territory, Nigeria';
  private companyName: string = 'Acropolis Park';
  private companyWebsite: string = 'https://acropolispark.ltd';

  constructor(private http: HttpClient, private timeService: TimeService) {
  }

  sendEmailAfterAppointmentCreated(appointment: EventBooking, venueName: string): Observable<any> {
    const to = appointment.customerEmail;
    const subject = 'Your appointment information';
    const time = `${appointment.startTime}:00 - ${appointment.endTime}:00`;

    const html = `<div>
    <p>Dear ${appointment.customerName}.</p>
    <p>This is a confirmation that you have booked <b>${venueName}</b>.</p>
    <p>We are waiting you on <b>${this.timeService.getDate(appointment.date)} at ${time}</b> at ${this.address}.</p>
    <p>Thank you for choosing our company.</p>
    <br />
    <p><b>${this.companyName}</b></p>
    <a href="${this.companyWebsite}">acropolispark.ltd</a>
    </div>`;

    return this.sendEmailRequest({to, subject, html});
  }

  private sendEmailRequest({to, subject, html}: any): Observable<any> {
    return this.http.post(this.url, {to, subject, html});
  }
}


