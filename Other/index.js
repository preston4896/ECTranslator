import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import App from "./components/App";

import Dashboard from "./components/Dashboard";
import "../style/reset.css";
import "_dashboard.scss";

const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={LoginForm} />
      <Route exact path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById("app"));
