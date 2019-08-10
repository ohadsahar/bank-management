import { MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import { combineLatest, concat, defer, Observable, of } from 'rxjs';


export function fromMatSort(sort: MatSort): Observable<Sort> {
  return concat(
    defer(() => of({
      active: sort.active,
      direction: sort.direction
    })),
    sort.sortChange.asObservable()
  );
}
export function paginateRows<U>(page$: Observable<PageEvent>): (obs$: Observable<U[]>) => Observable<U[]> {
  return (rows$: Observable<U[]>) => combineLatest(
    rows$,
    page$,
    (rows, page) => {
      const startIndex = page.pageIndex * page.pageSize;
      const copy = rows.slice();
      return copy.splice(startIndex, page.pageSize);
    }
  );
}
export function fromMatPaginator(pager: MatPaginator): Observable<PageEvent> {
  return concat(
    defer(() => of({
      pageIndex: pager.pageIndex,
      pageSize: pager.pageSize,
      length: pager.length,
    })),
    pager.page.asObservable()
  );
}

