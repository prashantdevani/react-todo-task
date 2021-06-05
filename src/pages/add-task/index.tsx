import React = require("react");
import { connect } from "react-redux";
import { ReduxType } from "../../reducers";
import "./index.scss";
import { XCircle } from "react-feather";
import { Button } from "../../components/button";
import { TaskController, TaskState } from "../../reducers/task";
import * as History from "history";
import { TaskModel } from "../../reducers/task/task-model";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const RegExNum = /^[0-9\b]+$/;
const ADD = "ADD";
const EDIT = "EDIT";

interface State {
  taskName: string;
  date: Date;
  status: string;
  action: string;
  error: {
    taskName?: string;
    date?: string;
    status?: string;
    action?: string;
  };
  show: boolean;
}

interface Props {
  location: History.Location;
  history: History.History;
  tasks: TaskState;
  reduxDispatch: any;
  action: string;
  match: any;
}

class AddTask extends React.Component<Props, State> {
  state: State = {
    taskName: "",
    date: new Date(),
    status: 'Active',
    action: "",
    error: {},
    show: false,
  };

  constructor(props: any) {
    super(props);
    if (props.action === EDIT) {
      const id = +props.match.params.id;
      const taskData = props.tasks.list.find(
        (value: TaskModel, index: number) => {
          return value.id === id;
        }
      );

      this.state = {
        ...this.state,
        ...taskData,
      };
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        show: true,
      });
    }, 10);
  }

  async submitForm() {
    this.state.error = {};
    let isFormValid = true;
    if (this.state.taskName.trim() === "") {
      this.state.error.taskName = "Task name should not be empty.";
      isFormValid = false;
    }
    if (this.state.status.toString().trim() === "") {
      this.state.error.status = "Status should not be empty.";
      isFormValid = false;
    }
    if (this.state.action.trim() === "") {
      this.state.error.action = "Action should not be empty.";
      isFormValid = false;
    }

    this.setState({});
    if (isFormValid) {
      try {
        if (this.props.action === EDIT) {
          const taskList: TaskModel[] = this.props.tasks.list
            ? [...this.props.tasks.list]
            : [];
          const id = +this.props.match.params.id;
          const taskData = taskList.find((value, index) => {
            return value.id === id;
          });

          if (taskData) {
            taskData.taskName = this.state.taskName;
            taskData.date = this.state.date;
            taskData.status = this.state.status;
            taskData.action = this.state.action;
          }

          await this.props.reduxDispatch(
            TaskController.setData(taskList)
          );
          this.props.history.push("/" + this.props.location.search);
          setTimeout(() => {
            alert(`Task updated successfully.`);
          });
        } else {
          const taskList: TaskModel[] = this.props.tasks.list
            ? [...this.props.tasks.list]
            : [];
          const taskSize: number = this.props.tasks.list
            ? this.props.tasks.list.length
            : 0;
          taskList.push({
            id: taskSize + 1,
            taskName: this.state.taskName,
            date: this.state.date,
            action: this.state.action,
            status: this.state.status,
            index: taskSize + 1,
          });
          await this.props.reduxDispatch(
            TaskController.setData(taskList)
          );
          this.props.history.push("/" + this.props.location.search);
          setTimeout(() => {
            alert(`Task added successfully.`);
          });
        }
      } catch {
        alert("Failed to add Task. Please try again.");
      }
    }
  }

  getInput(data: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
  }) {
    return (
      <div className={"row"}>
        <div className={"label"}>{data.label}</div>
        <input
          value={data.value}
          onChange={data.onChange}
          className={"textbox"}
        />
        {
          <div className={"error " + !!data.error}>
            {data.error ? data.error : "-"}
          </div>
        }
      </div>
    );
  }

  getDate(data: {
    label: string;
    value: Date;
    onChange: (date: Date) => void;
    error?: string;
  }) {
    return (
      <div className={"row"}>
        <div className={"label"}>{data.label}</div>
        <DatePicker className={"textbox my-date-picker"} selected={data.value} onChange={data.onChange} showTimeSelect dateFormat="MMMM d, yyyy h:mm aa"/>
        {
          <div className={"error " + !!data.error}>
            {data.error ? data.error : "-"}
          </div>
        }
      </div>
    );
  }

  getOptions(data: {
    label: string;
    options: string[];
    selected: string;
    onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
  }) {
    return (
      <div className={"row"}>
        <div className={"label"}>{data.label}</div>
        <select className={"textbox "} name={data.label} onChange={data.onSelect} style={{height: '34px'}}>
            {data.options.map(v => { 
                const option = data.selected === v ? (<option key={v} value={v} selected>{v}</option>) :(<option key={v} value={v}>{v}</option>)
                return option;
              })}
        </select>
        {
          <div className={"error " + !!data.error}>
            {data.error ? data.error : "-"}
          </div>
        }
      </div>
    );
  }

  render() {
    const formTitile =
      this.props.action === EDIT ? "Edit Task" : "Add Task";
    return (
      <div className={"add-task" + (this.state.show ? " show" : "")}>
        <div className={"form"}>
          <div className={"header"}>
            {formTitile}
            <div
              onClick={() => {
                this.props.history.push("/" + this.props.location.search);
              }}
              className={"close"}
            >
              <XCircle />
            </div>
          </div>
          <div className={"body"}>
            {this.getInput({
              label: "Task Name",
              value: this.state.taskName,
              error: this.state.error.taskName,
              onChange: (e) => {
                const value = e.target.value;
                this.setState({
                  taskName: value,
                });
              },
            })}
            {this.getOptions({
              label: "Status",
              selected: this.state.status,
              options: ['Active','InActive'],
              error: this.state.error.status,
              onSelect: (e) => {
                const value = e.target.value;
                this.setState({
                  status: value,
                });
              },
            })}
            {this.getDate({
              label: "Date",
              value: this.state.date,
              error: this.state.error.date,
              onChange: (date) => {
                this.setState({
                  date: date,
                });
              },
            })}
            {this.getInput({
              label: "Action",
              value: this.state.action,
              error: this.state.error.action,
              onChange: (e) => {
                const value = e.target.value;
                this.setState({
                  action: value,
                });
              },
            })}
          </div>
          <div className={"footer"}>
            <Button
              text={"Submit"}
              onClick={() => {
                this.submitForm();
              }}
              className={"submit"}
            />
          </div>
        </div>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(AddTask);
