import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-details',
  imports: [CommonModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {
  book = signal<Book | null>(null);
  loading = signal(true);

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(+id);
    }
  }

  loadBook(id: number): void {
    console.log('Loading book with ID:', id);
    this.apiService.getBookById(id).subscribe({
      next: (books) => {
        console.log('Book data received:', books);
        const foundBook = books && books.length > 0 ? books[0] : null;
        console.log('Found book:', foundBook);
        this.book.set(foundBook);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading book:', error);
        this.loading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  onEdit(): void {
    const currentBook = this.book();
    if (currentBook) {
      this.router.navigate(['/book/edit', currentBook.ID]);
    }
  }

  onBack(): void {
    this.router.navigate(['/']);
  }
}
