import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList implements OnInit {
  books = signal<Book[]>([]);
  filteredBooks = signal<Book[]>([]);
  searchText = signal('');
  loading = signal(true);

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private router: Router) {
    console.log('BookList constructor - filteredBooks length:', this.filteredBooks().length);
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    console.log('Loading books...');
    this.loading.set(true);
    this.apiService.getAllBooks().subscribe({
      next: (books) => {
        console.log('Books loaded:', books);
        console.log('Setting filteredBooks to:', books.length, 'books');
        this.books.set(books);
        this.filteredBooks.set([...books]);
        this.loading.set(false);
        this.cdr.detectChanges();
        console.log('After setting - filteredBooks length:', this.filteredBooks().length);
      },
      error: (error) => {
        console.error('Error loading books:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        this.loading.set(false);
        // נתונים דמה לבדיקה
        const dummyBooks = [
          { ID: 1, Title: 'ספר לדוגמה', Author: 'מחבר לדוגמה', Category: 'קטגוריה', Description: 'תיאור', PublishYear: 2024, AvailableCopies: 5, StatusId: 1, LocationId: 1 }
        ];
        this.books.set(dummyBooks);
        this.filteredBooks.set(dummyBooks);
      }
    });
  }

  onSearch(): void {
    this.apiService.searchBooks(this.searchText()).subscribe({
      next: (books) => {
        this.filteredBooks.set(books);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error searching books:', error);
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/book/new']);
  }

  onView(book: Book): void {
    this.router.navigate(['/book/view', book.ID]);
  }

  onEdit(book: Book): void {
    this.router.navigate(['/book/edit', book.ID]);
  }
}
