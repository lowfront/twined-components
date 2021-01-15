# Twined Components
<div align="center">
  <img alt="twined-components" src="https://raw.githubusercontent.com/lowfront/vscode-twined-components/master/logo.png" height="150px" />
  <div><a href="https://codesandbox.io/s/friendly-chaplygin-zyqhl?file=/src/App.js">Demo on CodeSandbox</a></div>
</div>


Extended component of a `styled-components` that prioritizes class names for use in `tailwindcss`, and so on...
Using the template literal grammar, you can write the class name and CSS code to the component. Like `styled-components`!
Available in `styled-components` v5 and above.
With [vscode-twined-components](https://marketplace.visualstudio.com/items?itemName=lowfront.vscode-twined-components), syntax highlight is supported when entering css code.


```js
// with Tailwindcss
const Button = twined.button`
  text-white bg-indigo-500 rounded-lg
`;
```

```js
// with Fontawesome
const IconReact = twined.i`
  fab fa-react
`;
```

`Twined-components` is an extended component of `styled-components` that returns styled-component.


## Why Twined-components?
Most of the CSS frameworks are created based on classnames. `Styled-components` can also write the classname. But, it is designed to make it easier to enter css code than to write the classname. However, we usually write the classname first and modify the details by writing down the CSS code, when using the CSS framework. `Twined-components` are designed to write class names first.

## Install
`Twined-components` is a component that simply extends `styled-components`. Therefore, dependence on `styled-components` is needed. 

```bash
npm i styled-components twined-components
```

## Example

```jsx
// with Tailwindcss
// with Fontawesome
import React from 'react';
import twined from 'twined-components';


// button base
const BorderlessButton = twined.button`
  border-0 px-6 py-2 rounded-lg
`;

// close button 
const Close = twined(BorderlessButton)`
  hidden absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-full
  items-center justify-center
  fas fa-times
`;

const ModalBackground = twined.div`
  fixed w-full h-full flex items-center justify-center bg-black bg-opacity-25 box-border p-10
`;

// Close is styled-components, so you can use the classname of Close.
const Modal = twined.div`
  relative flex items-center justify-center w-full h-full p-4 bg-white shadow text-2xl rounded-lg
`.css`
  :hover ${Close} {
    display: flex;
  }
`;

// Twined-components returns styled-components and can be expanded.
const Button = twined(BorderlessButton)`
  block ml-5
  ${({primary}) => primary && 'bg-indigo-500 text-white'}
`.css`
  ${({primary}) => primary && `font-weight: bold;`}
`;

<ModalBackground>
  <Modal>
    Hello World, this is my first twined component!
    <Button primary>Ok</Button>
    <Close />
  </Modal>
</ModalBackground>
```

## Roadmap
- [x] Add syntax highlighting
- [ ] Add Type inference
