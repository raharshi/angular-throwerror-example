import { Component, OnInit } from '@angular/core';
import { of, throwError, interval } from 'rxjs';
import { switchMap, debounceTime, catchError, retry, mergeMap } from 'rxjs/operators';

import { BookService } from './book.service';
import { Book } from './book';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
   selector: 'app-book',
   template: `
    <h3>Search Book</h3>
    <form [formGroup]="bookForm">
      ID: <input formControlName="bookId">
    </form>
    <br/>
    <div *ngIf="book">
      Id: {{book.id}}, Name: {{book.name}}, Category: {{book.category}}
    </div>
   `
})
export class BookComponent implements OnInit { 
   book: Book;
   constructor(private bookService: BookService, private formBuilder: FormBuilder) { }
   ngOnInit() {
      of(1,2,3,4).pipe(
        mergeMap(data => {
          if (data === 3) {
            return throwError('Error Occurred for data: '+ data);
          }
          return of(data);
        })
      ).subscribe(res => console.log(res),
         err => console.error(err)
      );

      interval(2000).pipe(
        mergeMap(x => x === 2
          ? throwError('Error: Received 2')
          : of('a', 'b')
        ),
      ).subscribe(x => console.log(x),
         e => console.error(e)
      );

      //-------------------------
      this.retryAndHandleError();
      this.searchBook();
   }

   retryAndHandleError() {
     let count =1;
    of("A", "B").pipe(
      switchMap(el => {
        // to get into processing complete line uncomment below line
        // if (el === "B" && count <3) {
        if (el === "B") {
          count ++;
         return throwError("Error occurred.");
        }
        return el;
      }),
      retry(2),
      catchError(err => {
        console.error(err);
        return throwError("User defined error.");
      })
    ).subscribe(el => console.log(el),
        err => console.error(err),
        () => console.log("Processing Complete.")
    );
   }

   bookId = new FormControl(); 
   bookForm: FormGroup = this.formBuilder.group({
      bookId: this.bookId
     }
   );
   searchBook() {
    this.bookId.valueChanges.pipe(
      debounceTime(1000),
      switchMap(id => {
        return this.bookService.getBook(id);
      }),
      catchError(err => {
        return throwError('Required Book Not Found');
      })
    ).subscribe(res => this.book = res,
        err => {
          console.error(err);
          this.book = null;
          this.searchBook();
        }
    ) 
  }
} 