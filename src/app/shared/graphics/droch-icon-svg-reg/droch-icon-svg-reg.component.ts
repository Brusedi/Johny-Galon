import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { toHtml } from '../corel-droch/corel-droch-base';
import { drochIcons } from '../corel-droch/corel-droch-data';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-droch-icon-svg-reg',
  templateUrl: './droch-icon-svg-reg.component.html',
  styleUrls: ['./droch-icon-svg-reg.component.css']
})
export class DrochIconSvgRegComponent implements OnInit {


  constructor( private matIconRegistry: MatIconRegistry ,private sanitized: DomSanitizer){
      

      // const a =  sanitized.bypassSecurityTrustHtml( toHtml(drochIcons['nva']) ); 
      // console.log(a);
      // this.matIconRegistry.addSvgIconLiteral('nva', a);

      // // Object.keys(drochIcons)
      // //    .forEach( x => this.matIconRegistry.addSvgIconLiteral( 'sss' ,
      // //     sanitized.bypassSecurityTrustHtml( 
      // //       " <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> "+
      // //       " <path d=\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z\"/>"+
      // //       " </svg> "

      // //      )

  }

  ngOnInit() {
    console.log(toHtml(drochIcons['nva']));

    // Object.keys(drochIcons)
    //   .forEach( x => this.matIconRegistry.addSvgIconLiteral( x , toHtml(drochIcons[x]) ) )
   
  }

}
