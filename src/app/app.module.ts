import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TitleComponent } from './title.component';
import { DraggingModule } from './directives/dragging/dragging.module';

@NgModule({
  imports:      [ BrowserModule, FormsModule, DraggingModule ],
  declarations: [ AppComponent, TitleComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
