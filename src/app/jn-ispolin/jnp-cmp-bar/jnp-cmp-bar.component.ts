import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-jnp-cmp-bar',
  templateUrl: './jnp-cmp-bar.component.html',
  styleUrls: ['./jnp-cmp-bar.component.css']
})
export class JnpCmpBarComponent implements OnInit {

  @Input() jncap: string;
  @Input() jnval: string;

  constructor() { }

  ngOnInit() {
  }

}
