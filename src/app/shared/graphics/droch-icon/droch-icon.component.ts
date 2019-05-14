import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { drawIconByOption } from '../corel-droch/corel-droch-base';

@Component({
  selector: 'droch-icon',
  templateUrl: './droch-icon.component.html',
  styleUrls: ['./droch-icon.component.css']
})
export class DrochIconComponent implements OnInit , AfterViewInit {

  @ViewChild('myCanvas') myCanvas: ElementRef;
  @Input('icon') icon: string;

  public context: CanvasRenderingContext2D;

  //private icon:string = undefined;

  constructor() { }

  ngOnInit() {
    
  }

  public ngAfterViewInit() {
    // get the context
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    drawIconByOption(this.context, ({presetName:this.icon, color:"red"}));
  }
}
