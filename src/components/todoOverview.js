import React from 'react';
import PropTypes from 'prop-types';
import { action, decorate, computed, observable } from 'mobx';
import { observer, inject, Provider } from 'mobx-react';

// Create a local variable with deep object values
class willBeUpdated {
  @observable _test = 5;
  @action increment = () => (this._test += 1);

  @computed get test() {
    return this._test;
  }

  setup() {
    setInterval(() => {
      this.increment();
    }, 500);
  }
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

  componentWillMount() {
    const { todoStore } = this.props;

    todoStore.willBeUpdated = new willBeUpdated();
    todoStore.willNotBeUpdated = new willNotBeUpdated();

    todoStore.willBeUpdated.setup();
    setInterval(() => {
      console.log(todoStore.willBeUpdated);
    }, 500);
  }
}
