import { Component, OnInit, Input } from '@angular/core';
import { findIconByName, toSvgPath } from '../corel-droch/corel-droch-base';
import { pipe, of } from 'rxjs';


@Component({
  selector: 'droch-icon-svg',
  templateUrl: './droch-icon-svg.component.html',
  styleUrls: ['./droch-icon-svg.component.css']
})
export class DrochIconSvgComponent implements OnInit {
  
  @Input('icon') icon: string;

  public iconPath:string;

  constructor() { }

  ngOnInit() {
    this.iconPath = toSvgPath( findIconByName(this.icon)) ;

    console.log(this.iconPath);
  }

}
