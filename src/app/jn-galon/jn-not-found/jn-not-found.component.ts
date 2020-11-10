import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-jn-not-found',
  templateUrl: './jn-not-found.component.html',
  styleUrls: ['./jn-not-found.component.css']
})
export class JnNotFoundComponent implements OnInit {

  constructor(private location: Location) { }

  
  back() {
      this.location.back();
  }

  ngOnInit() {
  }

}
