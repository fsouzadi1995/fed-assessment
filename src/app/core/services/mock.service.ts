import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  // Boolean just to fake the request
  public post<T>(endpoint: string, payload: T): Observable<boolean> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, payload).pipe(
      delay(3000),
      switchMap(() => {
        const rnd = Math.floor(Math.random() * 2);

        return rnd !== 0 ? of(true) : throwError('oh no');
      }),
    );
  }
}
