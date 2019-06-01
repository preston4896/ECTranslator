import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Dashboard extends Component {
  state = {
    selected: "home"
  };
  onItemClick = e => {
    console.log(e.target.attributes.name.name);
  };
  render() {
    const { selected } = this.state;
    return (
      <div className="dashboard">
        <nav className="left-bar">
          <li
            onClick={this.onItemClick}
            name="home"
            className="left-bar__item active"
          >
            <h2 className="left-bar__item"> Start Review </h2>
          </li>
          <li
            onClick={this.onItemClick}
            name="bills"
            className="left-bar__item"
          >
         
          </li>
        </nav>
        <main className="dashboard__main">
          <header className="dashboard__top">
            <h2 className="dashboard__top--label"> Lango! </h2>
            <div className="dashboard__top--right">
             
            </div>
          </header>
          <div className="dashboard__cards">
            <div className="dashboard__cards--card">
              <h2 className="dashboard__cards--heading"></h2>
            </div>
            <div className="dashboard__cards--card">
              <h2 className="dashboard__cards--heading"></h2>
            </div>
         
          </div>
        </main>
      </div>
    );
  }
}
