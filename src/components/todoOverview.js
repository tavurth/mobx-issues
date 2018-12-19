import React from 'react';
import PropTypes from 'prop-types';
import { action, decorate, computed, observable } from 'mobx';
import { observer, inject, Provider } from 'mobx-react';

// Create a local variable with deep object values
class willNotBeUpdated {
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

@inject('todoStore')
class WillNotBeUpdatedComponent extends React.Component {
  render() {
    return (
      <div className="view">
        <span>
          willNotBeUpdated:
          <label>{this.props.todoStore.willNotBeUpdated.test}</label>
        </span>
      </div>
    );
  }
}

@observer
export default class TodoOverview extends React.Component {
  render() {
    const { todoStore } = this.props;
    return (
      <Provider todoStore={todoStore}>
        <section className="main">
          <WillNotBeUpdatedComponent />
        </section>
      </Provider>
    );
  }

  componentWillMount() {
    const { todoStore } = this.props;

    todoStore.willNotBeUpdated = new willNotBeUpdated();
    todoStore.willNotBeUpdated.setup();

    setInterval(() => {
      console.log(todoStore.willNotBeUpdated.test);
    }, 500);
  }
}
