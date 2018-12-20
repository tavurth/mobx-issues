import React from 'react';
import PropTypes from 'prop-types';
import { action, decorate, computed, observable } from 'mobx';
import { observer, inject, Provider } from 'mobx-react';

class UpdaterStore {
  @observable willNotBeUpdated = null;
}

// Create a local variable with deep object values
class willNotBeUpdated {
  constructor() {
    this.setup();
  }

  @observable _test = 5;
  @action increment() {
    this._test += 1;
  }

  @computed get test() {
    return this._test;
  }

  setup() {
    setInterval(() => {
      this.increment();
    }, 500);
  }
}

const wrapper = (options = {}) => Component => {
  @inject('updaterStore')
  @observer
  class Wrapper extends React.Component {
    render() {
      const { updaterStore } = this.props;
      return <Component value={updaterStore['willNotBeUpdated']['test']} />;
    }
  }

  return Wrapper;
};

function WrappedComponent({ value }) {
  return (
    <div className="view" onClick={() => updaterStore.willNotBeUpdated.increment()}>
      <span>
        willNotBeUpdated:
        <label>{value}</label>
      </span>
    </div>
  );
}

WrappedComponent = wrapper()(WrappedComponent);

const updaterStore = new UpdaterStore();

// Create a new instance of our class (which is observable)
updaterStore.willNotBeUpdated = new willNotBeUpdated();

setInterval(() => {
  console.log(updaterStore.willNotBeUpdated.test);
}, 500);

export default function TodoOverview() {
  return (
    <Provider updaterStore={updaterStore}>
      <section className="main">
        <WrappedComponent />
      </section>
    </Provider>
  );
}
