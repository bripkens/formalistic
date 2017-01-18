import {createField, createMapForm} from 'formalized';
import React, { Component } from 'react';
import classNames from 'classnames';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: createMapForm()
        .put('email', createField())
        .put('password', createField())
    };
  }

  render() {
    const {form} = this.state;

    return (
      <form onSubmit={this.onSubmit}>

        {form.get('email').map(email =>
          <div className={classNames('form-group', {'has-error': !email.valid})}>
            <label htmlFor="email">
              Email address
            </label>
            <input type="email"
                   className="form-control"
                   id="email"
                   placeholder="Email"
                   value={email.value}
                   onChange={this.onChange.bind(this, 'email')} />
          </div>
        )}

        {form.get('password').map(password =>
          <div className={classNames('form-group', {'has-error': !password.valid})}>
            <label htmlFor="password">
              Password
            </label>
            <input type="password"
                   className="form-control"
                   id="password"
                   placeholder="Password"
                   value={password.value}
                   onChange={this.onChange.bind(this, 'password')} />
          </div>
        )}

        <button type="submit"
                className="btn btn-default"
                disabled={form.hierarchyValid} >
          Submit
        </button>

      </form>
    );
  }

  onChange(fieldName, e) {
    this.state.form.updateIn([fieldName], field =>
      field.setValue(e.target.value).setTouched(true)
    );
  }

  onSubmit(e) {
    e.preventDefault();

  }
}
