import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  description: string | null;
  image_url: string | null;
  pubDate: string;
  source_name: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage?: string;
}

@Injectable({ providedIn: 'root' })
export class NewsService {

  private baseUrl = 'https://newsdata.io/api/1/latest?apikey=pub_590a294a9e544a5984a2ecdc09ba1742&q=indian%20agriculture%20';

  constructor(private http: HttpClient) {}

  getNews(pageToken: string = ''): Observable<NewsResponse> {
    const url = pageToken
      ? `${this.baseUrl}&page=${pageToken}`
      : this.baseUrl;

    return this.http.get<NewsResponse>(url);
  }
}
