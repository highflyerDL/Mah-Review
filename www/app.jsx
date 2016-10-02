import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Main from "./components/Main";
import Auth from "./components/Auth";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Router history={browserHistory}>
          <Route path="/app" component={Main} >
            <IndexRoute component={ProductList}/>
            <Route path='/app/register' component={Auth} />
            <Route path='/app/home' component={ProductList} />
            <Route path='/app/product/:id' component={ProductDetails} />
            <Route path='/app*' component={NotFound} />
          </Route>
        </Router>
      </MuiThemeProvider>
    )
  }
}

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

export default App;
