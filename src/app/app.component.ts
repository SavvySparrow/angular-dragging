import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  VERSION,
  ViewChild
} from "@angular/core";
import { AngularDraggingDirective } from "./directives/dragging/dragging.directive";

type Square2D = {
  initialLeft: number;
  initialTop: number;
  currentBounds: any;
};

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent
  implements
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnInit {
  name = "Dragging";

  sqaure2DArray: Array<Square2D>;

  @ViewChild("boundary", { read: ElementRef, static: true })
  boundaryRef: ElementRef;

  dragArea: any;

  constructor(private ngZone: NgZone) {}
  ngOnInit(): void {
    //console.log("on init");
    this.dragArea = { offsetWidth: 102, offsetHeight: 102 };
    if (!this.sqaure2DArray) {
      this.initGenerateSquare2dArray();
    }
  }

  ngAfterViewChecked(): void {
    //console.log("on view checked");
  }

  ngAfterContentInit(): void {}
  ngAfterContentChecked(): void {
    //console.log("on content checked");
    if (!this.sqaure2DArray) {
      this.initGenerateSquare2dArray();
    }
  }

  ngAfterViewInit(): void {}

  initGenerateSquare2dArray() {
    this.sqaure2DArray = [];
    let tempQuad: any;
    const randomInt = this.getRandomInt(2, 2);
    [...Array(randomInt)].forEach((_, i) => {
      tempQuad = this.getXYQuad();
      this.sqaure2DArray.push({
        initialLeft: tempQuad.x,
        initialTop: tempQuad.y,
        currentBounds: {}
      });
    });
  }

  getXYQuad() {
    let found: boolean = false;
    let maxBoundX =
      (this.boundaryRef.nativeElement as HTMLElement).offsetWidth -
      this.dragArea.offsetWidth;
    let maxBoundY =
      (this.boundaryRef.nativeElement as HTMLElement).offsetHeight -
      this.dragArea.offsetHeight;
    let cordX: number;
    let cordY: number;
    let i = 0;
    this.ngZone.runOutsideAngular(() => {
      while (!found) {
        cordX = this.getRandomInt(0, maxBoundX);
        cordY = this.getRandomInt(0, maxBoundY);
        if (this.sqaure2DArray.length == 0) {
          console.log(`found at - (${cordX},${cordY})`);
          found = true;
        } else {
          let foundTemp = true;
          console.log(
            `do verify Quad - (${cordX},${cordY}) and length - ${
              this.sqaure2DArray.length
            }`
          );
          this.sqaure2DArray.every((item, index) => {
            //console.log(index,item.initialLeft,item.initialTop,"X",(cordX >= 0 && cordX < item.initialLeft-102),(cordX <= maxBoundX && cordX > item.initialLeft+102),"Y",(cordY >= 0 && cordY < item.initialTop-102),(cordY <= maxBoundY && cordY > item.initialTop+102))
            if (
              !(
                (cordX >= 0 &&
                  cordX < item.initialLeft - this.dragArea.offsetWidth) ||
                (cordX <= maxBoundX &&
                  cordX > item.initialLeft + this.dragArea.offsetWidth) ||
                (cordY >= 0 &&
                  cordY < item.initialTop - this.dragArea.offsetHeight) ||
                (cordY <= maxBoundY &&
                  cordY > item.initialTop + this.dragArea.offsetHeight)
              )
            ) {
              foundTemp = false;
              console.log("break loop");
              return false;
            }
            return true;
          });
          if (foundTemp) {
            console.log(`found at - (${cordX},${cordY})`);
            found = true;
          }
        }
        i++;
      }
    });

    return { x: cordX, y: cordY, isValid: found };
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum and minimun is inclusive
  }

  updateCurrentBounds(sqaure2D, cord) {
    sqaure2D.currentBounds = cord;
  }

  refresh() {
    AngularDraggingDirective.destroyCount = 0;
    this.sqaure2DArray = undefined;
  }
}
