import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Top3News } from './top3-news';

describe('Top3News', () => {
  let component: Top3News;
  let fixture: ComponentFixture<Top3News>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Top3News]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Top3News);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
