import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularDraggingDirective } from "./dragging.directive";
import { DraggingHandleDirective } from "./drag-handle.directive";

@NgModule({
  declarations: [AngularDraggingDirective,DraggingHandleDirective],
  imports: [CommonModule],
  exports: [AngularDraggingDirective,DraggingHandleDirective],
})
export class DraggingModule {}