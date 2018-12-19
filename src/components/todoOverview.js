import React from 'react';
import PropTypes from 'prop-types';
import { decorate, observable } from 'mobx';
import { observer, inject, Provider } from 'mobx-react';

// Create a local variable with deep object values
function willBeUpdated(updater) {
  this.test = 5;

  setInterval(() => {
    this.test += 1;
    updater(this);
  }, 500);
}

// Create a local variable with deep object values
function willNotBeUpdated() {
  this.test = 5;

  setInterval(() => {
    this.test += 1;
  }, 500);
}

@inject('todoStore')
class WillBeUpdatedComponent extends React.Component {
  render() {
    return (
      <div className="view">
        <span>
          willBeUpdated:
          <label>{this.props.todoStore.willBeUpdated.test}</label>
        </span>
      </div>
    );
  }
}

const wrapper = name => Component => {
  @observer
  @inject('todoStore')
  class Wrapper extends React.Component {
    render() {
      const { todoStore } = this.props;
      return <Component value={todoStore[name].test} />;
    }
  }

  return Wrapper;
};

function WillNotBeUpdatedComponent({ value }) {
  return (
    <div className="view">
      <span>
        willNotBeUpdated:
        <label>{value}</label>
      </span>
    </div>
  );
}

WillNotBeUpdatedComponent = wrapper('willNotBeUpdated')(WillNotBeUpdatedComponent);

@observer
export default class TodoOverview extends React.Component {
  render() {
    const { todoStore } = this.props;
    return (
      <Provider todoStore={todoStore}>
        <section className="main">
          <WillBeUpdatedComponent />
          <WillNotBeUpdatedComponent />
        </section>
      </Provider>
    );
  }

  updaterFunction = newWillBeUpdated => {
    const { todoStore } = this.props;

    console.log(todoStore.willBeUpdated.test);
    todoStore.willBeUpdated.test = newWillBeUpdated.test;
  };

  componentWillMount() {
    const { todoStore } = this.props;

    todoStore.willBeUpdated = decorate(
      // Try to use a runtime decorator
      // https://mobx.js.org/refguide/modifiers.html
      new willBeUpdated(this.updaterFunction),
      {
        test: observable,
      },
    );

    todoStore.willNotBeUpdated = new willNotBeUpdated();
  }
}
