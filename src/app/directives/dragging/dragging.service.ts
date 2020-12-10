import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class DraggingService {

  offsetX$: ReplaySubject<number> = new ReplaySubject(1);
  offsetY$: ReplaySubject<number> = new ReplaySubject(1);
  currentX$: ReplaySubject<number> = new ReplaySubject(1);
  currentY$: ReplaySubject<number> = new ReplaySubject(1);
}