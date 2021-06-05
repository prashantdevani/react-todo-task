import React = require("react");
import "./index.scss";
import { List, FileText, Trash, Edit } from "react-feather";
import { TaskModel } from "../../reducers/task/task-model";
import * as History from "history";
import { TaskController } from "../../reducers/task";

interface State {}

interface Props {
  data: TaskModel;
  reduxDispatch: any;
  location: History.Location;
  history: History.History;
}

export class TaskCard extends React.Component<Props, State> {
  state: State = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className={"task-card"}>
        <div className="user-image">
          <List />
        </div>
        <div className="info">
          <div className="row">
            <span className="label"> Task Name:</span> {`${this.props.data.taskName}`}
          </div>
          <div className="row">
            <span className="label"> Date:</span> {this.props.data.date.toString()}
          </div>
          <div className="row">
            <span className="label"> Status:</span> {this.props.data.status}
          </div>
          <div className="row">
            <span className="label"> Action:</span> {this.props.data.action}
          </div>
          <div
            onClick={async () => {
              this.props.history.push(
                "edit-task/"+ this.props.data.id + this.props.location.search
              );
            }}
            className="edit"
          >
            <Edit />
          </div>
          <div
            onClick={async () => {
              const shouldDelete = confirm("Are you sure. you want to delete!");
              if(shouldDelete) {
                this.props.reduxDispatch(TaskController.deleteTaskByindex(this.props.data.id))
              }
            }}
            className="delete"
          >
            <Trash />
          </div>
        </div>
      </div>
    );
  }
}