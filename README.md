# Twined Components

<div align="center">
  <img alt="twined-components" src="https://raw.githubusercontent.com/lowfront/vscode-twined-components/master/logo.png" height="150px" />
  <div><a href="https://codesandbox.io/s/friendly-chaplygin-zyqhl?file=/src/App.js">Demo on CodeSandbox</a></div><br/><br/>
</div>

Extended component of a `styled-components` that prioritizes class names for use in `tailwindcss`.
Using the template literal grammar, you can write the class name and CSS code to the component. Like `styled-components`!
Available in `styled-components` v5 and above.
With [vscode-twined-components](https://marketplace.visualstudio.com/items?itemName=lowfront.vscode-twined-components), syntax highlight and intellisense is supported when entering classname and css code.

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

## Why Twined-components

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
import React from "react";
import twined from "twined-components";

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

// Twined-components returns styled-components and can be expanded. It also optionally supports writing CSS as a JavaScript object instead of CSS code.
const Button = twined(BorderlessButton)`
  block ml-5
`.css(({ primary }) => ({
  ...(primary && { color: "white", background: "salmon", fontWeight: "bold" }),
}));

<ModalBackground>
  <Modal>
    Hello World, this is my first twined component!
    <Button primary>Ok</Button>
    <Close />
  </Modal>
</ModalBackground>;
```

## Typescript support

```tsx
import twined from "twined-components";

const Button = twined.button<{primary: boolean}>`
  ${({parimary}) => parimary : 'text-white bg-indigo-500' : ''} border-0 px-6 py-2 rounded-lg
`.css`
  text-align: center;
  ${({parimary}) => parimary : 'font-weight: bold;' : ''}
`;

<Button primary>Click</Button>
```

Type support is similar to `styled-components`. The props specified with the type is delivered equally to the class and css regions.

## For other versions

It also works in `styled-components` v4.1.0 version and later, but has several limitations.

### v4.2.0 and later

Unable to expand classname. Instead, `styled-component` can be extended. [Example](https://codesandbox.io/s/twined-components-demo-for-v420-or-later-cnn9m)

### v4.1.0 and later

When delivering `styled-components` to props in css method, could not get corresponding classname from scss code.

## Roadmap

- [x] Add Syntax highlighting
- [x] Add Type inference
- [x] Add Test code
