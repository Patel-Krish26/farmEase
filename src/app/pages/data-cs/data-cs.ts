import { Component, OnInit, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
//import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-cs.html',
  styleUrls: ['./data-cs.css']
})
export class DataComponent implements OnInit {

  // ✅ Signals
  apiData = signal<any[]>([]);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(true);

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.isLoading.set(true);

    this.dataService.getData().subscribe({
      next: (response: any) => {

        const formattedData = response.records.map((item: any) => ({
          ...item,

          private_sector__no__: Number(item.private_sector__no__),
          cooperative_sector__no__: Number(item.cooperative_sector__no__),
          public_sector__no__: Number(item.public_sector__no__),
          total_number: Number(item.total_number),

          private_sector_capacity__tonnes_: Number(item.private_sector_capacity__tonnes_),
          cooperative_sector_capacity__tonnes_: Number(item.cooperative_sector_capacity__tonnes_),
          public_sector_capacity__tonnes_: Number(item.public_sector_capacity__tonnes_),
          total_capacity__tonnes_: Number(item.total_capacity__tonnes_)
        }));

        this.apiData.set(formattedData);
        this.isLoading.set(false);
      },

      error: (error: any) => {
        this.errorMessage.set('Failed to load data');
        this.isLoading.set(false);
        console.error(error);
      }
    });
  }
}
