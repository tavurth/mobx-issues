import React from 'react';
import PropTypes from 'prop-types';
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

function WillBeUpdatedComponent({ value }) {
  return (
    <div className="view">
      <span>
        willBeUpdated:
        <label>{value}</label>
      </span>
    </div>
  );
}

WillBeUpdatedComponent = wrapper('willBeUpdated')(WillBeUpdatedComponent);

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

    todoStore.willBeUpdated = new willBeUpdated(this.updaterFunction);
    todoStore.willNotBeUpdated = new willNotBeUpdated();
  }
}
