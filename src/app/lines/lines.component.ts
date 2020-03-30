import { Component, Input } from '@angular/core';
import { Path } from './../Path';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css']
})
export class LinesComponent  {


  @Input() path: Path;

  constructor() {
   }

}
