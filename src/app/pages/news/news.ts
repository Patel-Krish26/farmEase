import { Component, OnInit, signal } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Card } from '../../Components/card/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [Card, CommonModule],
  templateUrl: './news.html',
  styleUrls: ['./news.css']
})
export class News implements OnInit {

  // ✅ Signals
  articles = signal<any[]>([]);
  nextPageToken = signal<string>('');
  loading = signal<boolean>(false);

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.fetchNews();
  }

  fetchNews() {
    if (this.loading()) return;

    this.loading.set(true);

    this.newsService.getNews(this.nextPageToken()).subscribe({
      next: (data: any) => {
        if (data && data.results) {
          const mapped = data.results.map((item: any) => ({
            title: item.title,
            description: item.description,
            imageUrl: item.image_url,
            label: item.category?.[0] || 'Agriculture',
            link: item.link
          }));

          // ✅ Append new articles
          this.articles.update(prev => [...prev, ...mapped]);
          // ✅ Updatenextpagetoken
          this.nextPageToken.set(data.nextPage);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error("Fetch Error:", err);
        this.loading.set(false);
      }
    });
  }

  loadMore() {
    if (this.nextPageToken()) {
      this.fetchNews();
    }
  }
}
