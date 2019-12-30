import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-jn-nameplate-card',
  templateUrl: './jn-nameplate-card.component.html',
  styleUrls: ['./jn-nameplate-card.component.css']
})
export class JnNameplateCardComponent implements OnInit {

  @Input() Caption: string;
  @Input() Description: string;
  @Input() IconName: string;
  @Input() RouterLink: string;

  constructor() { }

  ngOnInit() {
     console.log(this.Caption);
  }

}
