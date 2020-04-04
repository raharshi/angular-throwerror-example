import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    bookUrl = "/api/books";	
    constructor(private http: HttpClient) { }
    getBook(id: number): Observable<Book> {
      let url = this.bookUrl + "/" + id;   
      return this.http.get<Book>(url);
    }  
} 