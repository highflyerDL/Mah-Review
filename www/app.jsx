import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Main from "./components/Main";
import Auth from "./components/Auth";
import PostList from "./components/PostList";
import PostDetails from "./components/PostDetails";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Router history={browserHistory}>
          <Route path="/app" component={Main} >
            <IndexRoute component={PostList}/>
            <Route path='register' component={Auth} />
            <Route path='post/:id' component={PostDetails} />
            <Route path='*' component={NotFound} />
          </Route>
        </Router>
      </MuiThemeProvider>
    )
  }
}

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

export default App;
