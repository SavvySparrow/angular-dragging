import { Component, Input } from '@angular/core';

@Component({
  selector: 'sav-title',
  template: `
    <div style="display:flex;align-items: center;justify-content:space-between;padding: 0px 10px">
      <h1>{{name}}!</h1>
      <ng-content></ng-content>
    </div>`,
  styles: [`h1 { font-family: Lato; }`]
})
export class TitleComponent  {
  @Input() name: string;
}
