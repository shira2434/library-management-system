export interface Book {
  ID: number;
  Title: string;
  Author: string;
  Category: string;
  Description: string;
  StatusId: number;
  PublishYear: number;
  AvailableCopies: number;
  LocationId: number;
  StatusName?: string;
  LocationName?: string;
}

export interface Status {
  ID: number;
  Name: string;
  Description: string;
}

export interface Location {
  ID: number;
  LocationName: string;
  Description: string;
}