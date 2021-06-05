import { combineReducers, createStore } from "redux";
import { TaskController, TaskState } from "./task";

export type ReduxType = {
  tasks: TaskState;
};

type SyncReduxType = {
  [P in keyof ReduxType]: (
    state: Pick<ReduxType, P> | any,
    action: any
  ) => Pick<ReduxType, P> | any;
};

const reduxObj: SyncReduxType = {
  tasks: TaskController.reducer,
};

const reducer = combineReducers(reduxObj);

export const appStore = createStore(reducer);
