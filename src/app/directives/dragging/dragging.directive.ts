import { DOCUMENT } from "@angular/common";
import {
AfterViewChecked,
  AfterViewInit,
ContentChild,
    Directive,
  ElementRef,
EventEmitter,
    Inject,
Input,
NgZone,
        OnDestroy,
  OnInit,
Output
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DraggingHandleDirective } from "./drag-handle.directive";

@Directive({ selector: "[savDrag]" })
export class AngularDraggingDirective
  implements OnInit, AfterViewInit, OnDestroy {

  static destroyCount: number = 0;

  @Input('savDrag') bound: any;
  @Output('currentBounds') currentBounds: EventEmitter<any> = new EventEmitter();
  private element: HTMLElement;

  private subscriptions: Subscription[] = []

  @ContentChild(DraggingHandleDirective) handleElementRef: DraggingHandleDirective;
  handleElement: HTMLElement;
  draggingBoundaryElement: HTMLElement;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: any,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    //console.log('child view init')
    this.draggingBoundaryElement = (this.document as Document).querySelector(".drag-boundary");
    this.element = this.elementRef.nativeElement as HTMLElement;
    this.handleElement = this.handleElementRef?.elementRef.nativeElement as HTMLElement || this.element;
    this.initDrag();
  }
   ngOnInit(): void {
    //console.log('child on init')
  }
  ngOnDestroy(): void {
    //console.log(`Destroyed: (${this.bound.initialLeft},${this.bound.initialTop})`,++AngularDraggingDirective.destroyCount);
    this.subscriptions.forEach(s => {
      if(s) s.unsubscribe();
    });
  }

  initDrag() {
    const dragStart$ = fromEvent<MouseEvent>(this.handleElement, "mousedown");
    const dragEnd$ = fromEvent<MouseEvent>(this.document, "mouseup");
    const drag$ = fromEvent<MouseEvent>(this.document, "mousemove").pipe(
      takeUntil(dragEnd$)
    );

    // 2
    let initialX: number,
      initialY: number,
      currentX = 0,
      currentY = 0;

    let dragSub: Subscription;

    const minBoundX = currentX;
    const minBoundY = currentY;
    const maxBoundX =
      minBoundX +
      this.draggingBoundaryElement.offsetWidth -
      this.element.offsetWidth;
    const maxBoundY =
      minBoundY +
      this.draggingBoundaryElement.offsetHeight -
      this.element.offsetHeight;
      currentX = Math.max(minBoundX, Math.min(this.bound?this.bound.initialLeft:0, maxBoundX));
      currentY = Math.max(minBoundY, Math.min(this.bound?this.bound.initialTop:0, maxBoundY));
      this.generateNewBounds(currentX,currentY);
      
      //console.log(this.bound,currentX,currentY,maxBoundX,maxBoundY)
    // 3
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      //console.log(event.clientX, event.clientY, event.offsetX, event.offsetY);
      initialX = event.clientX - currentX
      initialY = event.clientY - currentY;
      //console.log("initial-axis", initialX, initialY);
      this.element.classList.add("free-dragging");

      // 4
      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.preventDefault();
          const x = event.clientX - initialX;
          const y = event.clientY - initialY;
          //console.log(event.clientX,event.clientY,x,y, event.offsetX);

          currentX = Math.max(minBoundX, Math.min(x, maxBoundX));
          currentY = Math.max(minBoundY, Math.min(y, maxBoundY));
          this.currentBounds.emit({x: currentX, y: currentY,width: this.element.offsetWidth,height: this.element.offsetHeight});
          this.element.style.transform =
            "translate3d(" + currentX + "px, " + currentY + "px, 0)";
      });
    });

    // 5
    const dragEndSub = dragEnd$.subscribe(() => {
      initialX = currentX;
      initialY = currentY;
      this.element.classList.remove("free-dragging");
      if (dragSub) {
        dragSub.unsubscribe();
      }
      
    });

    // 6
    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub
    ]);
  }

  generateNewBounds(currentX,currentY) {
    this.element.style.transform =
        "translate3d(" + currentX + "px, " + currentY + "px, 0)";
    this.ngZone.runOutsideAngular(() => {
      
    });
    setTimeout(() => {
        this.currentBounds.emit({x: currentX, y: currentY,width: this.element.offsetWidth,height: this.element.offsetHeight});
      },0)
    
  }

  // getXYQuad() {
  //   let found: boolean = false;
  //   let maxBoundX =
  //     this.draggingBoundaryElement.offsetWidth -
  //     this.element.offsetWidth;
  //   let maxBoundY =
  //     this.draggingBoundaryElement.offsetHeight -
  //     this.element.offsetHeight;
  //   let cordX: number;
  //   let cordY: number;
  //   let i = 0;
  //   this.ngZone.runOutsideAngular(() => {
  //     while (!found) {
  //       cordX = this.getRandomInt(0, maxBoundX);
  //       cordY = this.getRandomInt(0, maxBoundY);
  //       if (this.sqaure2DArray.length == 0) {
  //         //console.log(`found at - (${cordX},${cordY})`);
  //         found = true;
  //       } else {
  //         let foundTemp = true;
  //         // console.log(
  //         //   `do verify Quad - (${cordX},${cordY}) and length - ${
  //         //     this.sqaure2DArray.length
  //         //   }`
  //         // );
  //         this.sqaure2DArray.every((item, index) => {
  //           //console.log(index,item.initialLeft,item.initialTop,"X",(cordX >= 0 && cordX < item.initialLeft-102),(cordX <= maxBoundX && cordX > item.initialLeft+102),"Y",(cordY >= 0 && cordY < item.initialTop-102),(cordY <= maxBoundY && cordY > item.initialTop+102))
  //           if (
  //             !(
  //               (cordX >= 0 &&
  //                 cordX < item.initialLeft - this.dragArea.offsetWidth) ||
  //               (cordX <= maxBoundX &&
  //                 cordX > item.initialLeft + this.dragArea.offsetWidth) ||
  //               (cordY >= 0 &&
  //                 cordY < item.initialTop - this.dragArea.offsetHeight) ||
  //               (cordY <= maxBoundY &&
  //                 cordY > item.initialTop + this.dragArea.offsetHeight)
  //             )
  //           ) {
  //             foundTemp = false;
  //             //console.log("break loop");
  //             return false;
  //           }
  //           return true;
  //         });
  //         if (foundTemp) {
  //           //console.log(`found at - (${cordX},${cordY})`);
  //           found = true;
  //         }
  //       }
  //       i++;
  //     }
  //   });

  //   return { x: cordX, y: cordY, isValid: found };
  // }
}
