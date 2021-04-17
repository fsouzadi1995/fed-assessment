import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppEndpoints } from '@constants/global/endpoints.constants';
import { MockService } from '@core/services/mock.service';
import { NewsletterForm } from '@models/newsletter/newsletter-form.model';
import { NewsletterDto } from '@models/newsletter/newsletter.dto';
import { catchError, map, take } from 'rxjs/operators';
import { NewsletterResponse } from '@models/newsletter/newsletter-response.model';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private readonly moduleEndpoint: string = AppEndpoints.Newsletter;

  constructor(private readonly mockSvc: MockService) {}

  public saveNewsletter(newsletter: NewsletterForm): Observable<NewsletterResponse> {
    //  ...Do some processing from form model to DTO..

    return this.mockSvc.post<NewsletterDto>(this.moduleEndpoint, newsletter).pipe(
      map(() => ({ status: 'success', message: 'Thank you. You are now subscribed.' })),
      catchError(() => of({ status: 'error', message: 'Invalid Subscription request.' })),
      take(1),
    );
  }
}
