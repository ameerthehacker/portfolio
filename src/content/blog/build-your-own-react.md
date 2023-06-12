---
author: Ameer Jhan
pubDatetime: 2019-11-05T15:22:00Z
title: Build your own React in 90 lines of JavaScript
postSlug: build-your-own-react
featured: true
draft: false
tags:
  - react
  - javascript
  - code
description: React has so much magic but how many of us really understand what is going under the hood?
---

When I started learning React I felt whatever it did was pure magic, then I started to wonder what were the actual ingredients of this magic. I started to freak out when I realized whatever React does is very simple and we can build it with few lines of JavaScript if we are not betting on it for our next big startup. This is what has motivated me to write this article and hopefully after reading this, you will also feel the same way.

> What I cannot create, I do not understand - Richard Feynman

## Table of contents

## What features we will build?

### JSX

This is most obvious as we are building a React clone. We will also add event binding.

### Functional components

We will also support functional components with props.

### Class components with state

We will support the Class component with props and state to update our component.

### Lifecycle Hooks

For the sake of simplicity, we will implement only the componentDidMount() lifecycle hook.

## What we won't be building?

### Virtual DOM

Yes again for the sake of simplicity we will not implement our own virtual DOM at least in this article and we will use an off the shelf virtual DOM called snabbdom and the fun fact is that it is the virtual DOM used by Vue.js. You can read more about it [here](https://github.com/snabbdom/snabbdom).

### React Hooks

Some might get disappointed upon reading this but hey we don't want to chew more than we can so let us build the basic things first and we can always add on top of it. I also plan to write separate articles on implementing our own React hooks and virtual DOM on top of whatever we build here.

### Debuggability

This is one of the key parts which adds a level of complexity to any library or framework and since we are just doing this for fun we can safely ignore the debuggability features that React provides like the dev tools and profiler.

### Performance and portability

We won't be very much concerned about how efficient or how blazing fast our library is, we just want to build something that works. Let us also not put us through a hard time of making sure that it works on all the browsers in the market, it is fine if we can make it work at least on a few of the modern browsers.

## Let us get our hand dirty

![cat-computer](https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif)

Before we get started we need a scaffold with support for ES6, auto-reloading but no worries I have already set up a very basic Webpack scaffold with just that, you can clone and set it up from the link below.

[https://github.com/ameerthehacker/webpack-starter-pack](https://github.com/ameerthehacker/webpack-starter-pack)

### JSX

JSX is an open standard and it is not restricted to React in any way so we can use it without React and it is pretty easier than you might think. To understand how we can exploit JSX for our library let us see what happens behind the curtains when we use JSX.

```jsx
const App = (
  <div>
    <h1 className="primary">QndReact is Quick and dirty react</h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
  </div>
);

// The above jsx gets converted into
/**
 * React.createElement(type, attributes, children)
 * props: it is the type of the element ie. h1 for <h1></h1>
 * attributes: it is an object containing key value pair of props passed to the element
 * children: it the array of child elements inside it
 */
var App = React.createElement(
  "div",
  null,
  React.createElement(
    "h1",
    {
      className: "primary",
    },
    "QndReact is Quick and dirty react"
  ),
  React.createElement(
    "p",
    null,
    "It is about building your own React in 90 lines of JavsScript"
  )
);
```

As you can see every JSX element gets transformed into React.createElement(…) function call by the **@babel/plugin-transform-react-jsx** plugin, you can play more with JSX to JavaScript transformation [here](https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBAggBwTAvDAFAKBjAPAEwEsA3APmxzwAsBGGYAGwEMIIA5JgWwFMUAiBACdCnJoICefUgEUw-AErcmwWIQgxpAV0LAA1jCZyYRQVHExBSlbgD0tcpTwJSASVXqmAIxCbYn7QxEYADmMOI-gjAgAO5gMIrKqnEAnAAMMAyEYNzqIABmMABSTMQQAMrAwghQts4UtkRkmACUANxAA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.6.4&externalPlugins=)

For the above transformation to happen React needs to be in your scope while writing JSX, this is the reason why you get weird errors when you try to write JSX without React in your scope.
Let us first install the **@babel/plugin-transform-react-jsx** plugin

```zsh
npm install @babel/plugin-transform-react-jsx
```

Add the below config to the **.babelrc** file

```jsx
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "QndReact.createElement", // default pragma is React.createElement
      "throwIfNamespace": false // defaults to true
    }]
  ]
}
```

After this whenever Babel sees JSX it will call **QndReact.createElement(…)** but we have not yet defined that function so let us add it in **src/qnd-react.js**

```jsx
// file: src/qnd-react.js
const createElement = (type, props = {}, ...children) => {
  console.log(type, props, children);
};

// to be exported like React.createElement
const QndReact = {
  createElement,
};

export default QndReact;
```

We have console logged **type, props, children** to understand what are being passed to us. To test whether our transformation of JSX is working let us write some JSX in **src/index.js**

```jsx
// file: src/index.js
// QndReact needs to be in scope for JSX to work
import QndReact from "./qnd-react";

const App = (
  <div>
    <h1 className="primary">QndReact is Quick and dirty react</h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
  </div>
);
```

Now you should see something like this in your console.

![console.log of JSX](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/jsx-console-log.png?raw=true)

From the above information, we can create our own internal **virtual DOM node** using **snabbdom** which we can then use for our [reconciliation](https://reactjs.org/docs/reconciliation.html) process. Let us first install snabbdom using command below.

```zsh
npm install snabbdom
```

Let us now create and return our **virtual DOM node** whenever **QndReact.createElement(...)** is called

```jsx
// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  return h(type, { props }, children);
};

// to be exported like React.createElement
const QndReact = {
  createElement,
};

export default QndReact;
```

Great now we can parse JSX and create our own virtual DOM nodes but still, we are not able to render it to the browser. To do so let us add a **render** function in **src/qnd-react-dom.js**

```jsx
// file: src/qnd-react-dom.js

// React.render(<App />, document.getElementById('root'));
// el -> <App />
// rootDomElement -> document.getElementById('root')
const render = (el, rootDomElement) => {
  // logic to put el into the rootDomElement
};

// to be exported like ReactDom.render
const QndReactDom = {
  render,
};

export default QndReactDom;
```

Rather than us handling the heavy lifting of putting the elements on to the DOM let us make snabbdom do it, for that we need to first initialize snabbdom with required modules. Modules in snabbdom are kind of plugins that allow snabbdom to do more only if it is required.

```jsx
// file: src/qnd-react-dom.js
import * as snabbdom from "snabbdom";
import propsModule from "snabbdom/modules/props";

// propsModule -> this helps in patching text attributes
const reconcile = snabbdom.init([propsModule]);

// React.render(<App />, document.getElementById('root'));
// el -> <App />
// rootDomElement -> document.getElementById('root')
const render = (el, rootDomElement) => {
  // logic to put el into the rootDomElement
  reconcile(rootDomElement, el);
};

// to be exported like ReactDom.render
const QndReactDom = {
  render,
};

export default QndReactDom;
```

Let us use our brand new **render** function to do some magic in **src/index.js**

```jsx
// file: src/index.js
// QndReact needs to be in scope for JSX to work
import QndReact from "./qnd-react";
import QndReactDom from "./qnd-react-dom";

const App = (
  <div>
    <h1 className="primary">QndReact is Quick and dirty react</h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
  </div>
);

QndReactDom.render(App, document.getElementById("root"));
```

Voila! we should see our JSX being rendered to the screen.

![jsx-rendered](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/jsx-rendered.png?raw=true)

Wait we have one little problem when we call render function twice we will get some weird error in the console, the reason behind that is only the first time we can call the **reconcile** method on a real DOM node followed by that we should call it with the virtual DOM node it returns when called for the first time.

```jsx
// file: src/qnd-react-dom.js
import * as snabbdom from "snabbdom";
import propsModule from "snabbdom/modules/props";

// propsModule -> this helps in patching text attributes
const reconcile = snabbdom.init([propsModule]);
// we need to maintain the latest rootVNode returned by render
let rootVNode;

// React.render(<App />, document.getElementById('root'));
// el -> <App />
// rootDomElement -> document.getElementById('root')
const render = (el, rootDomElement) => {
  // logic to put el into the rootDomElement
  // ie. QndReactDom.render(<App />, document.getElementById('root'));
  // happens when we call render for the first time
  if (rootVNode == null) {
    rootVNode = rootDomElement;
  }

  // remember the VNode that reconcile returns
  rootVNode = reconcile(rootVNode, el);
};

// to be exported like ReactDom.render
const QndReactDom = {
  render,
};

export default QndReactDom;
```

Sweet we have a working JSX rendering in our app, let us now move to render a functional component rather than some plain HTML.

Let us add a functional component called **Greeting** to **src/index.js** as shown below.

```jsx
// file: src/index.js
// QndReact needs to be in scope for JSX to work
import QndReact from "./qnd-react";
import QndReactDom from "./qnd-react-dom";

// functional component to welcome someone
const Greeting = ({ name }) => <p>Welcome {name}!</p>;

const App = (
  <div>
    <h1 className="primary">QndReact is Quick and dirty react</h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
    <Greeting name={"Ameer Jhan"} />
  </div>
);

QndReactDom.render(App, document.getElementById("root"));
```

Ah oh! we get some error in the console as shown below.

![functional-component-error](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/functional-component-error.png?raw=true)

Let us see what is going on by placing a console.log in the **QndReact.createElement(...)** method

```jsx
// file: src/qnd-react.js
import { h } from 'snabbdom';

const createElement = (type, props = {}, ...children) => {
  console.log(type, props, children);

  return h(type, { props }, children);
};

...

```

![functional-component-console](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/functional-component-console-log.png?raw=true)

We can see that the type that is being passed is a JavaScript **function** whenever there is a functional component. If we call that function we will get the HTML result that the component wishes to render.

Now we need to check whether that type of the **type** argument is **function** if so we call that function as **type(props)** if not we handle it as normal HTML elements.

```jsx
// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  // if type is a function then call it and return it's value
  if (typeof type == "function") {
    return type(props);
  }

  return h(type, { props }, children);
};

// to be exported like React.createElement
const QndReact = {
  createElement,
};

export default QndReact;
```

Hurray! we have our functional component working now.

![functional-component-working](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/functional-component-working.png?raw=true)

Great we have done a lot, let us take a deep breath and a cup of coffee with a pat on our back as we are almost done implementing React, we have one more piece to complete the puzzle **Class** components.

![minions-cheering](https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif)

We will create our **Component** base class in **src/qnd-react.js** as shown below.

```jsx
// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  // if type is a function then call it and return it's value
  if (typeof type == "function") {
    return type(props);
  }

  return h(type, { props }, children);
};

// component base class
class Component {
  constructor() {}

  componentDidMount() {}

  setState(partialState) {}

  render() {}
}

// to be exported like React.createElement, React.Component
const QndReact = {
  createElement,
  Component,
};

export default QndReact;
```

Cool let us write our first **Counter** class component in **src/counter.js**

```jsx
// file: src/counter.js
import QndReact from "./qnd-react";

export default class Counter extends QndReact.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    console.log("Component mounted");
  }

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
```

Yes I know we have not yet implemented any logic for our counter but don't worry we will add those moving parts once we get our state management system up and running. Let us now try to render it in our **src/index.js**

```jsx
// file: src/index.js
// QndReact needs to be in scope for JSX to work
import QndReact from "./qnd-react";
import QndReactDom from "./qnd-react-dom";
import Counter from "./counter";

// functional component to welcome someone
const Greeting = ({ name }) => <p>Welcome {name}!</p>;

const App = (
  <div>
    <h1 className="primary">QndReact is Quick and dirty react</h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
    <Greeting name={"Ameer Jhan"} />
    <Counter />
  </div>
);

QndReactDom.render(App, document.getElementById("root"));
```

As expected we have an error in the console 😉 as shown below.

![class component error](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/class-component-error.png?raw=true)

Does the above error looks familiar, you might get the above error in React when you try to use a class component without inheriting from **React.Component** class. To know why this is happening let us add a **console.log** in **React.createElement(...)** as shown below.

```jsx
// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  console.log(typeof (type), type);
  // if type is a function then call it and return it's value
  if (typeof type == "function") {
    return type(props);
  }

  return h(type, { props }, children);
};

...

```

Now peep into the console to see what is being logged.

![class-component-console](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/class-component-console-log.png?raw=true)

You can see that the type of Counter is also a function, this is because at the end of the day **Babel** will be converting ES6 class into plain JavaScript function, then how are we going to handle the Class component case. Well, we can add a **static property** to our **Component** base class which we can then use to check whether **type** argument being passed is a Class. This is the same way React handles it, you can read Dan's blog on it [here](https://overreacted.io/how-does-react-tell-a-class-from-a-function/)

```jsx
// file: src/qnd-react.js
import { h } from "snabbdom";

...

// component base class
class Component {
  constructor() { }

  componentDidMount() { }

  setState(partialState) { }

  render() { }
}

// add a static property to differentiate between a class and a function
Component.prototype.isQndReactClassComponent = true;

// to be exported like React.createElement, React.Component
const QndReact = {
  createElement,
  Component
};

export default QndReact;
```

Let us now add some code to handle Class component in our **QndReact.createElement(...)**

```jsx
// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  // if type is a Class then
  // 1. create a instance of the Class
  // 2. call the render method on the Class instance
  if (type.prototype && type.prototype.isQndReactClassComponent) {
    const componentInstance = new type(props);

    return componentInstance.render();
  }
  // if type is a function then call it and return it's value
  if (typeof type == "function") {
    return type(props);
  }

  return h(type, { props }, children);
};

// component base class
class Component {
  constructor() {}

  componentDidMount() {}

  setState(partialState) {}

  render() {}
}

// add a static property to differentiate between a class and a function
Component.prototype.isQndReactClassComponent = true;

// to be exported like React.createElement, React.Component
const QndReact = {
  createElement,
  Component,
};

export default QndReact;
```

Hurray! we have Class component rendering something to the browser

![class-component-working](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/class-component-rendered.png?raw=true)

Phew! let us move on to adding state to our Class component, before that it is important to understand that the responsibility of how to update the DOM whenever you call **this.setState({...})** lies with **react-dom** package rather than React. This is to keep React's core parts like the **Component** class decoupled from the platform which in turn promotes high code reusability i.e in React native also you can use the same **Component** class while **react-native** package takes care of how to update the mobile UI. You might be now asking yourself how would React know what to do when **this.setState({...})** is called, the answer is react-dom communicates it with React by setting an **\_\_updater** property on React. Dan has an excellent article about this too which you can read over [here](https://overreacted.io/how-does-setstate-know-what-to-do/). Let us now make **QndReactDom** to add a **\_\_updater** property to **QndReact**

```jsx
// file: src/qnd-react-dom.js
import QndReact from './qnd-react';
import * as snabbdom from 'snabbdom';
import propsModule from 'snabbdom/modules/props';

...

// QndReactDom telling React how to update DOM
QndReact.__updater = () => {
  // logic on how to update the DOM when you call this.setState
}

// to be exported like ReactDom.render
const QndReactDom =  {
  render
};

export default QndReactDom;
```

Whenever we call **this.setState({...})** we need to compare the **oldVNode** of the component and the **newVNode** of the component generated by calling **render** function on the component, for this purpose of comparison let us add a **\_\_vNode** property on the Class component to maintain the current VNode instance of the component.

```jsx
// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  // if type is a Class then
  // 1. create a instance of the Class
  // 2. call the render method on the Class instance
  if (type.prototype && type.prototype.isQndReactClassComponent) {
    const componentInstance = new type(props);

    // remember the current vNode instance
    componentInstance.__vNode = componentInstance.render();

    return componentInstance.__vNode;
  }
  // if type is a function then call it and return it's value
  if (typeof type == "function") {
    return type(props);
  }

  return h(type, { props }, children);
};

// component base class
class Component {
  constructor() {}

  componentDidMount() {}

  setState(partialState) {}

  render() {}
}

// add a static property to differentiate between a class and a function
Component.prototype.isQndReactClassComponent = true;

// to be exported like React.createElement, React.Component
const QndReact = {
  createElement,
  Component,
};

export default QndReact;
```

Let us now implement our **setState** function on our **Component** base class

```jsx
// file: src/qnd-react.js
import { h } from "snabbdom";

...

// component base class
class Component {
  constructor() { }

  componentDidMount() { }

  setState(partialState) {
    // update the state by adding the partial state
    this.state = {
      ...this.state,
      ...partialState
    }
    // call the __updater function that QndReactDom gave
    QndReact.__updater(this);
  }

  render() { }
}

// add a static property to differentiate between a class and a function
Component.prototype.isQndReactClassComponent = true;

// to be exported like React.createElement, React.Component
const QndReact = {
  createElement,
  Component
};

export default QndReact;
```

Cool let us now handle the **\_\_updater** function in **QndReactDom**

```jsx
// file: src/qnd-react-dom.js
import QndReact from './qnd-react';
import * as snabbdom from 'snabbdom';
import propsModule from 'snabbdom/modules/props';

...

// QndReactDom telling React how to update DOM
QndReact.__updater = (componentInstance) => {
  // logic on how to update the DOM when you call this.setState

  // get the oldVNode stored in __vNode
  const oldVNode = componentInstance.__vNode;
  // find the updated DOM node by calling the render method
  const newVNode = componentInstance.render();

  // update the __vNode property with updated __vNode
  componentInstance.__vNode = reconcile(oldVNode, newVNode);
}

...

export default QndReactDom;
```

Awesome let us now check whether our **setState** implementation is working by adding state to our **Counter Component**

```jsx
import QndReact from "./qnd-react";

export default class Counter extends QndReact.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };

    // update the count every second
    setInterval(() => {
      this.setState({
        count: this.state.count + 1,
      });
    }, 1000);
  }

  componentDidMount() {
    console.log("Component mounted");
  }

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
```

Great, we have our **Counter** component working as expected.

![counter-working](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/video.gif?raw=true)

Let us add the **ComponentDidMount** life cycle hook. Snabbdom provides hooks by which we can find whether a virtual DOM node was added, destroyed or updated on the actual DOM, you can read more about it [here](https://github.com/snabbdom/snabbdom#hooks)

```jsx
// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  // if type is a Class then
  // 1. create a instance of the Class
  // 2. call the render method on the Class instance
  if (type.prototype && type.prototype.isQndReactClassComponent) {
    const componentInstance = new type(props);

    // remember the current vNode instance
    componentInstance.__vNode = componentInstance.render();

    // add hook to snabbdom virtual node to know whether it was added to the actual DOM
    componentInstance.__vNode.data.hook = {
      create: () => {
        componentInstance.componentDidMount()
      }
    }

    return componentInstance.__vNode;
  }
  // if type is a function then call it and return it's value
  if (typeof type == "function") {
    return type(props);
  }

  return h(type, { props }, children);
};

...

export default QndReact;
```

Wonderful we have completed the implementation of Class component with componentDidMount life cycle hook support.

Let us finish things off by adding event binding support, to do that let us update our **Counter** component by adding a button called increment and incrementing the counter only when the button is clicked. Please beware that we are following the usual JavaScript based event naming convention rather than React based naming convention i.e for double click event use **onDblClick** and not **onDoubleClick**.

```jsx
import QndReact from "./qnd-react";

export default class Counter extends QndReact.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    console.log("Component mounted");
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button
          onClick={() =>
            this.setState({
              count: this.state.count + 1,
            })
          }
        >
          Increment
        </button>
      </div>
    );
  }
}
```

The above component is not going to work as we have not told our **VDom** how to handle it. First, let us add the event listener module to Snabdom

```jsx
// file: src/qnd-react-dom.js
import * as snabbdom from 'snabbdom';
import propsModule from 'snabbdom/modules/props';
import eventlistenersModule from 'snabbdom/modules/eventlisteners';
import QndReact from './qnd-react';

// propsModule -> this helps in patching text attributes
// eventlistenersModule -> this helps in patching event attributes
const reconcile = snabbdom.init([propsModule, eventlistenersModule]);
...
```

Snabdom wants the **text attributes** and **event attributes** as two seperate objects so let us do that

```jsx
// file: src/qnd-react.js
import { h } from 'snabbdom';

const createElement = (type, props = {}, ...children) => {
  ...

  props = props || {};
  let dataProps = {};
  let eventProps = {};

  // This is to seperate out the text attributes and event listener attributes
  for(let propKey in props) {
    // event props always startwith on eg. onClick, onDblClick etc.
    if (propKey.startsWith('on')) {
      // onClick -> click
      const event = propKey.substring(2).toLowerCase();

      eventProps[event] = props[propKey];
    }
    else {
      dataProps[propKey] = props[propKey];
    }
  }

  // props -> snabbdom's internal text attributes
  // on -> snabbdom's internal event listeners attributes
  return h(type, { props: dataProps, on: eventProps }, children);
};

...

// to be exported like React.createElement, React.Component
const QndReact = {
  createElement,
  Component
};

export default QndReact;
```

The counter component will now increment whenever the button is clicked.

![event-working](https://github.com/ameerthehacker/project-assets/blob/master/qnd-react/event-video.gif?raw=true)

Awesome we have finally reached the end of our quick and dirty implementation of React yet we still can't render lists and I want to give it to you as a fun little task. I would suggest you to try rendering a list in **src/index.js** and then debug **QndReact.createElement(...)** method to find out what is going wrong.

Thanks for sticking around with me and hopefully you enjoyed building your own React and also learned how React works while doing so. If you are stuck at any place feel free to refer the code in the repo that I have shared below.

[https://github/ameerthehacker/qnd-react](https://github/ameerthehacker/qnd-react)

If you wish to learn more like implementing React fiber with your own Virtual DOM please read this super awesome article [Didact: a DIY guide to build your own React](https://engineering.hexacta.com/didact-learning-how-react-works-by-building-it-from-scratch-51007984e5c5)
