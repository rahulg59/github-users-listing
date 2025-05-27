import { Component, Input } from '@angular/core';
import { UserInfoModel } from '../../models/user-info.model';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() userInfo!: UserInfoModel;
}
