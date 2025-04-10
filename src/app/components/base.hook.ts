import { ChangeDetectorRef, Component, ComponentRef, OnDestroy, ViewContainerRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, Subject, tap } from 'rxjs';
import { UnsubscribeHook } from './unsubscribe.hook';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

export function compareObjects(obj1: Object, obj2: Object): boolean {
  return JSON.stringify(obj1)?.toLocaleLowerCase()
    === JSON.stringify(obj2)?.toLocaleLowerCase();
}

@Component({
  template: '',
})
// tslint:disable-next-line:component-class-suffix
export abstract class BaseSDKHook extends UnsubscribeHook implements OnDestroy {
  loading = true;
  needLading = true;
  // Variables
  formGroup!: FormGroup;
  total = 1;
  pageIndex = 0;
  page = 0;
  countPerPage = 10;
  readonly pageSizeOptions = [5, 7, 10, 13, 15, 17, 20, 25, 30, 50, 100];
  nzWidthConfig = ['10%', '10%', '10%'];
  nzScroll = {x: '10px', y: '10px'};
  allowRedirects = false;
  nzSortOrder: 'ascend' | 'descend' | null = null;
  protected subject$: Subject<void> = new Subject<void>();

  // Dependencies
  protected formBuilder!: FormBuilder;
  protected emptyFilter!: Object;
  protected cd!: ChangeDetectorRef;

  sortNameFn = (a: any, b: any) => a.name.localeCompare(b.name);

  ngOnInit(): void {
    this.initRefresh();
    this.onFormGroupValueChanges();
  }

  pageChange(page: number): void {
    if (isNaN(page)) {
      return;
    }

    this.page = page - 1;
    this.refresh();
  }

  pageChangeLocal(page: number): void {
    if (isNaN(page)) {
      return;
    }

    this.page = page - 1;
    this.pageIndex = page - 1;
  }

  changePageSize(size: number): void {
    this.countPerPage = size;
    this.page = 0;

    this.refresh();
  }

  changePageSizeLocal(size: number): void {
    this.countPerPage = size;
    this.page = 0;
    this.pageIndex = 0;
  }

  disableResetButton(): boolean {
    return this.page === 0 && compareObjects(this.formGroup.getRawValue(), this.emptyFilter);
  }

  filterReset(): void {
    this.formGroup.reset({...this.emptyFilter});
  }

  protected setFiltersData = (): void => {
    this.page = 0;
    this.refresh();
  };

  protected onFormGroupValueChanges(): void {
    this.formGroup.valueChanges
      .pipe(
        filter(() => this.formGroup.valid),
        distinctUntilChanged(),
        debounceTime(500),
        takeUntil(this.unsubscribe$))
      .subscribe(this.setFiltersData);
  }

  protected initRefresh(): void {
    this.subject$
      .pipe(
        tap(this.loadStart),
        switchMap(this.getData),
        takeUntil(this.unsubscribe$),
      ).subscribe();

  }

  // @ts-ignore
  protected abstract getData = (): Observable<any> => {
  };


  preventDefault = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    this.subject$.next();
    this.subject$.complete();
  }

  refresh = (): void => {
    this.subject$.next();
  };

  loadStart = (): void => {
    this.loading = true;
    this.cd.detectChanges();
  };

  loadStop = (): void => {
    this.loading = false;
    this.cd.detectChanges();
  };

  trackByFn(index: number): number {
    return index;
  }

  trackById(_: number, data: any): string {
    return data?.id;
  }

  trackByName(_: number, item: any): string {
    return item?.title;
  }

  ladingIsRequired = (): void => {
    this.needLading = true;
  };

  loadingDoesNotRequired = (): void => {
    this.needLading = false;
  };

  ifLoadingRequired = (): void => {
    this.needLading ? this.loadStart() : this.ladingIsRequired();
  };

}
