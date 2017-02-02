import {createField, createMapForm, notBlankValidator} from 'formalized';
import React, { Component } from 'react';
import classNames from 'classnames';
import {isEmail} from 'validator';

export default class Login extends Component {
  constructor(props) {
    super(props);

    const emailField = createField({
      value: '',
      validator(value) {
        if (isEmail(value)) {
          return null;
        }

        return [{
          severity: 'error',
          message: 'Please provide a valid email address.'
        }];
      }
    });

    const passwordField = createField({
      value: '',
      validator: notBlankValidator
    });

    this.state = {
      form: createMapForm()
        .put('email', emailField)
        .put('password', passwordField)
    };
  }

  render() {
    const {form} = this.state;

    return (
      <form onSubmit={e => this.onSubmit(e)}>

        {form.get('email').map(email =>
          <div className={classNames('form-group', {'has-error': !email.valid && email.touched})}>
            <label htmlFor="email">
              Email address
            </label>
            <input type="email"
                   className="form-control"
                   id="email"
                   placeholder="Email"
                   value={email.value}
                   onChange={this.onChange.bind(this, 'email')} />
            {email.touched && email.messages.map((message, i) =>
              <span className="help-block"
                    key={i}>
                {message.message}
              </span>
            )}
          </div>
        )}

        {form.get('password').map(password =>
          <div className={classNames('form-group', {'has-error': !password.valid && password.touched})}>
            <label htmlFor="password">
              Password
            </label>
            <input type="password"
                   className="form-control"
                   id="password"
                   placeholder="Password"
                   value={password.value}
                   onChange={this.onChange.bind(this, 'password')} />
            {password.touched && password.messages.map((message, i) =>
              <span className="help-block"
                    key={i}>
                {message.message}
              </span>
            )}
          </div>
        )}

        <button type="submit"
                className="btn btn-default"
                disabled={!form.hierarchyValid && form.touched} >
          Submit
        </button>

      </form>
    );
  }

  onChange(fieldName, e) {
    const updatedForm = this.state.form.updateIn([fieldName], field =>
      field.setValue(e.target.value).setTouched(true)
    );

    this.setState({
      form: updatedForm
    });
  }

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, {recurse: true})
      });
      return;
    }

    const form = this.state.form;
    alert(`Signing in ${form.get('email').value} with password ${form.get('password').value}`);
  }
}
