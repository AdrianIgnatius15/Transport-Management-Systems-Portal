import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  public readonly currentDate: Date;

  constructor() {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
      
  }
}
