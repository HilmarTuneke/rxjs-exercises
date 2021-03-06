import {Injectable} from '@angular/core';
import {iif, Observable, of} from 'rxjs';
import {debounceTime, filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';

export interface Backend {
  getAutocompleteValues(input: string): Observable<Array<string>>;
}

@Injectable({
  providedIn: 'root'
})
export class Level6Service {

  empty$: Observable<Array<string>> = of([]);

  constructor() {
  }

  /**
   * return an observable that produces an autocomplete list for the stream of inputs based on the
   * given backend with the following requirements:
   * <UL>
   *   <LI>do not return a list if not at least 2 characters have been given</LI>
   *   <LI>when the source changes rapidly (<500ms), do not load the data</LI>
   *   <LI>do not return data if there is already a new input value before the previous input has been processed</LI>
   * </UL>
   */
  getAutocompleteList(inputObservable$: Observable<string>, backend: Backend): Observable<Array<string>> {
    return inputObservable$.pipe(
      debounceTime(500),
      switchMap(v => iif(() => v.length > 1, backend.getAutocompleteValues(v), this.empty$)));
  }
}
