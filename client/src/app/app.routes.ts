import { Routes } from '@angular/router';
import { BookList } from './components/book-list/book-list';
import { BookForm } from './components/book-form/book-form';
import { BookDetails } from './components/book-details/book-details';

export const routes: Routes = [
  { path: '', component: BookList },
  { path: 'book/new', component: BookForm },
  { path: 'book/edit/:id', component: BookForm },
  { path: 'book/view/:id', component: BookDetails }
];
