import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const endpoint = 'http://35.223.177.19:8080/api/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class RestserviceService {

  constructor(private http: HttpClient) {

  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getItems(): Observable<any> {
    return this.http.get(endpoint + 'items').pipe(
      map(this.extractData));
  }

  getOrders(): Observable<any> {
    return this.http.get(endpoint + 'order').pipe(
      map(this.extractData));
  }

  addItem (item: any): Observable<any> {
    return this.http.post<any>(endpoint + 'items/', JSON.stringify(item), httpOptions).pipe(
      tap((item) => console.log(`added product w/ id=`)),
      catchError(this.handleError<any>('addItem'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
