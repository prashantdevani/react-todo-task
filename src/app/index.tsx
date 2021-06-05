import React = require("react");
import "./index.scss";
import { hot } from "react-hot-loader/root";
import { Provider } from "react-redux";
import { appStore } from "../reducers";
import { HashRouter, Route, Switch } from "react-router-dom";
import Home from "../pages/home";
import AddTask from "../pages/add-task";
export type AppState = {};

class App extends React.Component<any, AppState> {
  state: AppState = {
    isAdded: false,
  };

  render() {
    return (
      <>
        <div className={"app"}>
          <Home history={this.props.history} location={this.props.location} />
        </div>
        <Switch>
          <Route path="/add-task" component={(props: any) => <AddTask {...props} action="ADD"/>} />
          <Route path="/edit-task/:id" component={(props: any) => <AddTask {...props} action="EDIT"/>} />
        </Switch>
      </>
    );
  }
}

export default hot(() => {
  return (
    <Provider store={appStore}>
      <HashRouter>
        <Route path="/" component={App} />
      </HashRouter>
    </Provider>
  );
});
