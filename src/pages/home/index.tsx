import * as React from "react";
import "./index.scss";
import { ReduxType } from "../../reducers";
import { connect } from "react-redux";
import { Pagination } from "../../components/pagination";
import { TaskCard } from "../../components/task-card";
import { TaskModel } from "../../reducers/task/task-model";
import { TaskController, TaskState } from "../../reducers/task";
import { Button } from "../../components/button";
import * as History from "history";

export type Props = {
  reduxDispatch: any;
  tasks: TaskState;
  location: History.Location;
  history: History.History;
};

export type State = {
  fetching: boolean;
  count: number;
  currentPage: number;
  serachValue: string;
};

class Home extends React.Component<Props, any> {
  state: State = {
    fetching: false,
    currentPage: 1,
    count: 0,
    serachValue:'',
  };

  constructor(props: any) {
    super(props);
    const query = new URLSearchParams(this.props.location.search);
    const page = query.get("page");
    if (!page) {
      this.props.history.push("/?page=1");
    } else {
      this.state.currentPage = parseInt(page);
    }
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    return {
      serachValue: nextProps.tasks.searchText,
    };
  }
  getBody() {
    const PaginationComponent = (<Pagination
    onChange={(newPageNumber) => {
      this.props.history.push("?page=" + newPageNumber);
      this.setState(
        {
          currentPage: newPageNumber,
        },
        () => {
          this.loadtasks();
        }
      );
    }}
    currentPage={this.state.currentPage}
    pageSize={6}
    count={this.state.count}
  />)

  const pageSize = this.getDataLength();

  const NoData = ( <div className="header" style={{textAlign: 'center'}} >No data</div>);
    return (
      <div className={"web3"}>
        <div className="address">Todo Task</div>
        {this.props.tasks.filteredlist && (
          <div className="tasks">
            <div className="header">
              List of Task
              <div style={{display:'flex', float:'right'}}>
                <div className="search">
                <div>
                    <input
                      value={this.state.serachValue}
                      placeholder={'Serach'}
                      onChange={(e) => {
                        this.props.reduxDispatch(TaskController.setSearch(e.target.value))
                      }}
                      className={"textbox"}
                    /> 
                  </div> 
                </div>
                <Button
                    text={"Add Task"}
                    onClick={() => {
                      this.props.history.push(
                        "add-task" + this.props.location.search
                      );
                    }}
                  />
              </div>
            </div>
            <div className="list">
              {this.props.tasks.filteredlist &&
                this.props.tasks.filteredlist.map((data, index) => {
                  return (
                    <TaskCard
                      history={this.props.history}
                      location={this.props.location}
                      reduxDispatch={this.props.reduxDispatch}
                      data={data}
                      key={data.id.toString()}
                    />
                  );
                })}
            </div>
            {pageSize && pageSize > 0 ? null : NoData}
            {pageSize && pageSize > 0 ? PaginationComponent : null}
          </div>
        )}
      </div>
    );
  }

  render() {
    return this.getBody();
  }

  loadtasks() {
    const cardSize = 6;
    const from = (this.state.currentPage - 1) * cardSize;
    const to = from + cardSize > this.state.count ? this.state.count: from + cardSize;
    const list: TaskModel[] = [];
    const taskList: TaskModel[] = this.props.tasks.searchText ? this.props.tasks.searchedlist || [] : this.props.tasks.list || [];
    for (let index = from; index < to; index++) {
      if(taskList) {
        list.push(taskList[index]);
      }
    }
    this.props.reduxDispatch(TaskController.setFilteredData(list));
  }

  getDataLength() {
    if(this.props.tasks.searchText) {
      return this.props.tasks.searchedlist?.length;
    }
    if(this.props.tasks.list) {
      return this.props.tasks.list.length;
    }
    return 0;
  }
  
  async loadLib() {
    const count = await this.getDataLength();
    this.setState({
      count,
    });
    this.loadtasks();
  }

  componentDidUpdate(preProps: any, preState: any) {
    if(this.props.tasks.list && preProps.tasks.list) {
      if(this.props.tasks.list.length !== preProps.tasks.list.length) {
        this.loadData();
      }
    }

    if(this.state.serachValue !==  preState.serachValue) {
      this.setState({
        currentPage: 1,
      })
      this.props.history.push("/?page=1" );
      this.loadData();
    }
  }

  async loadData() {
    const searchText = this.props.tasks.searchText.toLocaleLowerCase();
    if(this.props.tasks.searchText) {
      let sreachedList: TaskModel[] = [];
      sreachedList = this.props.tasks.list ? this.props.tasks.list.filter((task, index) =>  {
        const tName  = task.taskName.toLocaleLowerCase();
        if(tName.indexOf(searchText) >= 0) {
          return true
        } 
     
        return false;
      }) : [];

      await this.props.reduxDispatch(TaskController.setSearchedData(sreachedList));
      await this.loadLib();
    } else {
      await this.loadLib();
    }
    
  }

  async componentDidMount() {
   await this.loadData();
  }
}

const mapStateToProps = (state: ReduxType) => {
  return {
    tasks: state.tasks,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    reduxDispatch: dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
