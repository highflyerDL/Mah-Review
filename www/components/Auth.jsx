import React, { Component } from 'react'
import callApi from '../util/callApi';

class Auth extends Component {
  constructor() {
    super();
    this.state = { name: "", email: "", password: "" };
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onUsernameChange(e) {
    this.setState({ name: e.target.value });
  }

  onPasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  onEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    var body = {name: this.state.name, email: this.state.email, password: this.state.password};
    callApi("register", "POST", body).then(res => console.log(res), res2=>console.log("error", res2));
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" placeholder="Username" value={this.state.name} onChange={this.onUsernameChange}/>
        <input type="text" placeholder="Email" value={this.state.email} onChange={this.onEmailChange}/>
        <input type="password" placeholder="Password" value={this.state.password} onChange={this.onPasswordChange}/>
        <input type="submit" value="Register"/>
      </form>
    )
  }
}

export default Auth;
