import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularDraggingDirective } from "./dragging.directive";

@NgModule({
  declarations: [AngularDraggingDirective],
  imports: [CommonModule],
  exports: [AngularDraggingDirective],
})
export class DraggingModule {}