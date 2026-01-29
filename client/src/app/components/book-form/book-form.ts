import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Book, Status, Location } from '../../models/book.model';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-book-form',
  imports: [CommonModule, ReactiveFormsModule, NotificationComponent],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm implements OnInit {
  bookForm: FormGroup;
  statuses = signal<Status[]>([]);
  locations = signal<Location[]>([]);
  categories = signal<string[]>([]);
  isEditMode = signal(false);
  bookId = signal<number | null>(null);
  
  // הודעות
  showNotification = signal(false);
  notificationMessage = signal('');
  notificationType = signal<'success' | 'error' | 'info'>('success');

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      Title: ['', Validators.required],
      Author: ['', Validators.required],
      Category: ['', Validators.required],
      Description: [''],
      PublishYear: ['', [Validators.required, Validators.min(1000)]],
      AvailableCopies: ['', [Validators.required, Validators.min(0)]],
      StatusId: ['', Validators.required],
      LocationId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
    this.checkEditMode();
  }

  loadDropdownData(): void {
    this.apiService.getStatuses().subscribe(statuses => this.statuses.set(statuses));
    this.apiService.getLocations().subscribe(locations => this.locations.set(locations));
    this.apiService.getCategories().subscribe(categories => 
      this.categories.set(categories.map(c => c.Category))
    );
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.bookId.set(+id);
      this.loadBook(+id);
    }
  }

  loadBook(id: number): void {
    this.apiService.getBookById(id).subscribe({
      next: (books) => {
        if (books && books.length > 0) {
          const book = books[0];
          this.bookForm.patchValue(book);
        }
      },
      error: (error) => {
        console.error('Error loading book:', error);
        this.showMessage('שגיאה בטעינת הספר', 'error');
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.notificationMessage.set(message);
    this.notificationType.set(type);
    this.showNotification.set(true);
    
    // סגירה אוטומטית אחרי 3 שניות
    setTimeout(() => {
      this.showNotification.set(false);
    }, 3000);
  }

  onNotificationClose(): void {
    this.showNotification.set(false);
  }

  onSubmit(): void {
    console.log('onSubmit called');
    if (this.bookForm.valid) {
      const bookData = { ...this.bookForm.value };
      
      if (this.isEditMode() && this.bookId()) {
        bookData.ID = this.bookId();
        console.log('Updating book...');
        this.apiService.updateBook(bookData).subscribe({
          next: () => {
            this.showMessage('הספר עודכן בהצלחה! 🎉', 'success');
            setTimeout(() => this.router.navigate(['/']), 2000);
          },
          error: (error) => {
            console.error('Error updating book:', error);
            this.showMessage('שגיאה בעדכון הספר ❌', 'error');
          }
        });
      } else {
        console.log('Creating book...');
        this.apiService.createBook(bookData).subscribe({
          next: () => {
            this.showMessage('הספר נוסף בהצלחה! 🎉', 'success');
            setTimeout(() => this.router.navigate(['/']), 2000);
          },
          error: (error) => {
            console.error('Error creating book:', error);
            this.showMessage('שגיאה בהוספת הספר ❌', 'error');
          }
        });
      }
    } else {
      console.log('Form is invalid');
      this.showMessage('אנא מלא את כל השדות החובה ⚠️', 'error');
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}