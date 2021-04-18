import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppEndpoints } from '@constants/global';
import { MockService } from '@core/services';
import { NewsletterForm, NewsletterDto, NewsletterResponse } from '@models/newsletter';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private readonly moduleEndpoint: string = AppEndpoints.Newsletter;

  constructor(private readonly mockSvc: MockService) {}

  public saveNewsletter(newsletter: NewsletterForm): Observable<NewsletterResponse> {
    const dto = Object.entries(newsletter).reduce((obj, kvp) => {
      const [key, value] = kvp;

      return { ...obj, [key]: typeof value === 'string' ? encodeURI(value.trim()) : value };
    }, {} as NewsletterDto);

    return this.mockSvc.post<NewsletterDto>(this.moduleEndpoint, dto).pipe(
      map(() => ({ status: 'success', message: 'Thank you. You are now subscribed.' })),
      catchError(() => of({ status: 'error', message: 'Invalid Subscription request.' })),
    );
  }
}
