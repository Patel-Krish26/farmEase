import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataComponent as DataCs } from './data-cs';

describe('DataCs', () => {
  let component: DataCs;
  let fixture: ComponentFixture<DataCs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataCs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataCs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
