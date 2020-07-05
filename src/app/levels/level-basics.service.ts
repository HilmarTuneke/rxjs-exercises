import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

/**
 * a simple service to be implemented so that the test is successful
 */
@Injectable({
  providedIn: 'root'
})
export class LevelBasicsService {

  private resultValue: any;

  constructor() {
  }

  get resultValueForTest(): any {
    return this.resultValue;
  }

  /**
   * return an observable that produces the values 1, 1, 2, 3, 5, 8, 13 in order
   */
  deliverSomeValues(): Observable<number> {
    return of(1, 1, 2, 3, 5, 8, 13);
  }

  /**
   * subscribe to the given observable and store the last value it produces in
   * <code>this.resultValue</code>.
   * Assume that the given observable works asynchronously.
   */
  subscribeAndSetValue(inputObservable$: Observable<number>): void {
    const subscription = inputObservable$.subscribe(
      v => this.resultValue = v,
      () => subscription.unsubscribe(),
      () => subscription.unsubscribe());
  }

}
