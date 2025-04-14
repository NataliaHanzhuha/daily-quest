import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventBooking } from '../../models/task';
import { TimeService } from '../time.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly url: string = environment.backendUrl + 'send-email';
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

  sendEmailForPaymentAfterAdminCreatedEvent(appointment: EventBooking, venueName: string): Observable<any> {
    const to = appointment.customerEmail;
    const subject = 'Payment Request for approve your Acropolis Park event';
    const time = `${appointment.startTime}:00 - ${appointment.endTime}:00`;
    const url = `${environment.frontendUrl}services/request-payment/${appointment.id}`;
    const html = `<div>
    <p>Dear ${appointment.customerName}.</p>
    <p>Payment a confirmation that you have booked <b>${venueName}</b>, <b>${this.timeService.getDate(appointment.date)} at ${time}</b> at ${this.address}.</p>

    <p>Please, follow this url to finish your payment: ${url}</p>
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


