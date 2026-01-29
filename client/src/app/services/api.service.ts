import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, Status, Location } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5001/api/exec';

  constructor(private http: HttpClient) { }

  // All operations through /api/exec
  getAllBooks(): Observable<Book[]> {
    return this.http.post<Book[]>(this.baseUrl, {
      procedureName: 'GetAllBooks',
      parameters: {}
    });
  }

  searchBooks(searchText: string = ''): Observable<Book[]> {
    return this.http.post<Book[]>(this.baseUrl, {
      procedureName: 'SearchBooks',
      parameters: { SearchText: searchText }
    });
  }

  getBookById(id: number): Observable<Book[]> {
    return this.http.post<Book[]>(this.baseUrl, {
      procedureName: 'Books_GetById',
      parameters: { Id: id }
    });
  }

  createBook(book: Partial<Book>): Observable<Book[]> {
    return this.http.post<Book[]>(this.baseUrl, {
      procedureName: 'AddBook',
      parameters: {
        Title: book.Title,
        Author: book.Author,
        Category: book.Category,
        Description: book.Description,
        StatusId: book.StatusId,
        PublishYear: book.PublishYear,
        AvailableCopies: book.AvailableCopies,
        LocationId: book.LocationId
      }
    });
  }

  updateBook(book: Partial<Book>): Observable<Book[]> {
    return this.http.post<Book[]>(this.baseUrl, {
      procedureName: 'UpdateBookById',
      parameters: {
        ID: book.ID,
        Title: book.Title,
        Author: book.Author,
        Category: book.Category,
        Description: book.Description,
        StatusId: book.StatusId,
        PublishYear: book.PublishYear,
        AvailableCopies: book.AvailableCopies,
        LocationId: book.LocationId
      }
    });
  }

  deleteBook(id: number): Observable<any> {
    return this.http.post<any>(this.baseUrl, {
      procedureName: 'DeleteBook',
      parameters: { BookId: id }
    });
  }

  changeBookStatus(id: number, statusId: number): Observable<any> {
    return this.http.post<any>(this.baseUrl, {
      procedureName: 'ChangeStatus',
      parameters: { BookID: id, NewStatusID: statusId }
    });
  }

  getStatuses(): Observable<Status[]> {
    return this.http.post<Status[]>(this.baseUrl, {
      procedureName: 'GetAllStatuses',
      parameters: {}
    });
  }

  getLocations(): Observable<Location[]> {
    return this.http.post<Location[]>(this.baseUrl, {
      procedureName: 'GetAllLocations',
      parameters: {}
    });
  }
}