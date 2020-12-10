import { Component, VERSION } from '@angular/core';
import { DraggingService } from './directives/dragging/dragging.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Dragging';

  constructor(public service: DraggingService) {

  }
}
