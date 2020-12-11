import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
ElementRef,
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
    AfterViewChecked {
  name = "Dragging";

  sqaure2DArray: Array<Square2D>;

  @ViewChild('boundary',{read: ElementRef,static: true}) boundaryRef: ElementRef;

  constructor() {}
  ngAfterViewChecked(): void {
    // if (!this.sqaure2DArray) {
    //   this.initGenerateSquare2dArray();
    // }
  }

  ngAfterContentInit(): void {}
  ngAfterContentChecked(): void {
    if (!this.sqaure2DArray) {
      this.initGenerateSquare2dArray();
    }
  }

  ngAfterViewInit(): void {
  }

  initGenerateSquare2dArray() {
    this.sqaure2DArray = [];
    const randomInt = this.getRandomInt(2, 10);
    [...Array(randomInt)].forEach((_, i) => {
      this.sqaure2DArray.push({
        initialLeft: this.getRandomLeft(),
        initialTop: this.getRandomTop(),
        currentBounds: {}
      });
    });
    console.log(this.sqaure2DArray.length, this.sqaure2DArray);
  }

  getRandomLeft(): number {
    let found: boolean = false;
    let maxBound = (this.boundaryRef.nativeElement as HTMLElement).offsetWidth - 102;
    maxBound = 1444;
    let cord: number = this.getRandomInt(0, maxBound);
    let i = 0;
    while (!found) {
      if (this.sqaure2DArray.length == 0) {
        console.log("First",i,cord,maxBound);
        found = true;
      } else {
        this.sqaure2DArray.every((item,index) => {
          cord = this.getRandomInt(0, maxBound);
          if (cord > item.initialLeft + 100) {
            console.log("Rest",cord);
            found = true;
            return false;
          } else {
            return true;
          }
        });
      }
      i++;
    }
    console.log(found,cord);
    if(found) return cord;
    else return this.getRandomInt(0, maxBound);
  }

  getRandomTop(): number {
    return this.getRandomInt(0, 553);
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  updateCurrentBounds(sqaure2D, cord) {
    sqaure2D.currentBounds = cord;
  }

  refresh() {
    AngularDraggingDirective.destroyCount = 0;
    this.sqaure2DArray = undefined;
  }
}
