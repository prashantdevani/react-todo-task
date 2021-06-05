import { TaskModel } from "./task-model";

export const TaskAxtionTypes = {
  Set: "Categories_Set",
  Ft_Data: "Filtered_Data_Action",
  Ft_Sreach_Data: "Ft_Sreach_Data",
  load_data_storage_list: "Filtered_Data_Action",
  search_completed: "search_completed",
  searching: "searching",
  deleteTaskByindex: "deleteTaskByindex",
};

export type TaskState = {
  list?: TaskModel[];
  filteredlist?: TaskModel[]; 
  searchedlist?: TaskModel[]; 
  searchText: string; 
};

const localStorageList: string = localStorage.getItem('TaskList') || '';
let taskList: TaskModel[] = [];

if(localStorageList) {
  taskList = JSON.parse(localStorageList);
  for (const task of taskList) {
    task.date = new Date(task.date)
  }
}

const defaultTask:TaskModel[] = []

for (let i = 1; i < 8; i++) {
    defaultTask.push({
      id: i,
      taskName: `Task ${i}`,
      date: new Date(new Date().getTime() * i),
      status: 'Active',
      action: `Task ${i} Action`,
      index: i,
    })
}


export class TaskController {
  
  static value: TaskState = {
    list: localStorageList ? taskList : defaultTask,
    filteredlist: undefined,
    searchedlist: undefined,
    searchText: ''
  };

  static reducer(state = TaskController.value, action: any) {
    if (action && action.type === TaskAxtionTypes.Set) {
      if(action.localSave) {
        localStorage.setItem('TaskList', JSON.stringify(action.list))
      }
      state = {
        ...state,
        list: action.list,
      };
    }

    if (action && action.type === TaskAxtionTypes.Ft_Sreach_Data) {
      state = {
        ...state,
        searchedlist: action.searchedList,
      };
    } 
    
    if (action && action.type === TaskAxtionTypes.Ft_Data) {
      state = {
        ...state,
        filteredlist: action.filteredlist
      }
    }

    if (action && action.type === TaskAxtionTypes.deleteTaskByindex) {
      const currentList: TaskModel[] = state.list as TaskModel[]; 
      const list = currentList.filter((value) => {
        if(action.id === value.id) {
          return false
        } 
        return true;
      })
      localStorage.setItem('TaskList', JSON.stringify(list))
      state = {
        ...state,
        list,
      }
    }

    if (action && action.type === TaskAxtionTypes.search_completed) {
      state = {
        ...state,
        searchText: action.searchText
      }
    }
    return state;
  }

  static setData(list: TaskModel[], localSave: boolean = true) {
    return {
      type: TaskAxtionTypes.Set,
      list, 
      localSave,
    };
  }

  static setFilteredData(filteredlist: TaskModel[]) {
    return {
      type: TaskAxtionTypes.Ft_Data,
      filteredlist,
    };
  }
  
  static deleteTaskByindex(id: number) {
    return {
      type: TaskAxtionTypes.deleteTaskByindex,
      id,
    };
  }

  static setSearchedData(searchedList: TaskModel[]) {
    return {
      type: TaskAxtionTypes.Ft_Sreach_Data,
      searchedList,
    };
  }

  static setSearch(searchText: string) {
    return {
      type: TaskAxtionTypes.search_completed,
      searchText,
    };
  }
}
