import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiCourse {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  category?: string;
  coverImageUrl?: string;
  price?: number;
  level?: string;
  language?: string;
  instructorId?: string;
  isPublished?: boolean;
  popularScore?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Update this base URL if your backend runs on different host/port.
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  // Popular endpoints remove kar diye hain (backend me /api/courses/popular nahi hai)
  // isliye method hata diya gaya.
}


