import { Injectable } from '@angular/core';
import {Observable, EMPTY, from, iif, of, zip, forkJoin, GroupedObservable} from 'rxjs';

import { UserService } from '../user/user.service';
import { TodoService } from '../todo/todo.service';
import { TodoWithUser } from './todo-with-user';
import {Todo} from '../todo/todo';
import {User} from '../user/user';
import {concatMap, first, groupBy, last, map, mergeMap, reduce, tap, toArray} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private users: Map<number, User> = new Map();
  private userObservables: Map<number, Observable<User>> = new Map();

  constructor(
    private userService: UserService,
    private todoService: TodoService
  ) {}

  /*
  getTodosWithUsersGroupBy(): Observable<TodoWithUser[]> {
    const todo$: Observable<Todo> = this.todoService.getTodos().pipe(concatMap(array => from(array)));
    const groups$: Observable<GroupedObservable<boolean, Todo>> = todo$.pipe(groupBy(todo => this.users.has(todo.userId)));
  }
  */

  getTodosWithUsers(): Observable<TodoWithUser[]> {
    const todo$: Observable<Todo> = this.todoService.getTodos().pipe(concatMap(array => from(array)));
    const user$: Observable<User> = todo$.pipe(mergeMap(todo => this.getUser(todo.userId)));
    return zip(todo$, user$).pipe(map(([todo, user]) => ({todo, user})), toArray());
  }

  getTodosWithUsersSeveralCallsPerUser(): Observable<TodoWithUser[]> {
    const todo$: Observable<Todo> = this.todoService.getTodos().pipe(concatMap(array => from(array)));
    const user$: Observable<User> = todo$.pipe(mergeMap(todo => iif(() => this.users.has(todo.userId),
      of(this.users.get(todo.userId)),
      this.userService.getUser(todo.userId).pipe(tap(user => this.users.set(user.id, user))))));
    return zip(todo$, user$).pipe(map(([todo, user]) => ({todo, user})), toArray());
  }

  private getUser(userId: number): Observable<User> {
    if(!this.userObservables.has(userId)) {
      this.userObservables.set(userId, this.userService.getUser(userId));
    }
    return this.userObservables.get(userId);
  }
}
