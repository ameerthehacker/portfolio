import React from 'react';
import Intro from '../../components/intro/intro';
import Works from '../works/works';
import { Switch, Route } from 'react-router-dom'

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Intro} />
      <Route path="/works" component={Works} />
    </Switch>
  );
}

export default App;
