import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { drochIcons } from './shared/graphics/corel-droch/corel-droch-data';
import { toHtml } from './shared/graphics/corel-droch/corel-droch-base';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Johny-Galon-app';

  constructor( private matIconRegistry: MatIconRegistry ,private sanitized: DomSanitizer){

    //Register
    Object.keys(drochIcons)
      .forEach( x => 
        this.matIconRegistry.addSvgIconLiteral( 
          x , sanitized.bypassSecurityTrustHtml( toHtml(drochIcons[x]) ) 
      ))

  }    
  

}
