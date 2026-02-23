import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-order.page',
  standalone: false,
  templateUrl: './order.page.component.html',
  styleUrl: './order.page.component.css'
})
export class OrderPageComponent implements OnInit {
  constructor(private readonly userProfileSvc: UserProfileService) {}

  async ngOnInit(): Promise<void> {
    
  }
}
