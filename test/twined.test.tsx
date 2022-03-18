import React, { useState } from "react";
import renderer from "react-test-renderer";
import styled from "styled-components";
import twined from "../src";

const { act } = renderer;

const BorderlessButton = twined.button`
  border-0 px-6 py-2 rounded-lg
`;
const Close = twined(BorderlessButton)<{ right: number }>`
  hidden
  absolute
  right-${({ right }) => right}
  top-0
  transform
  translate-x-1/2
  -translate-y-1/2
  w-10
  h-10
  bg-black
  text-white
  rounded-full
  items-center
  justify-center
  fas
  fa-times
`;

test("Twined has classNames.", () => {
  const component = renderer.create(<BorderlessButton>Click</BorderlessButton>);
  const tree = component.toJSON() as renderer.ReactTestRendererJSON;
  expect(tree.type).toEqual("button");

  expect(tree.props.className).toEqual(
    expect.stringContaining("border-0 px-6 py-2 rounded-lg")
  );
});

test("Twined has props.", () => {
  const component = renderer.create(<Close right={3}>Close</Close>);
  const tree = component.toJSON() as renderer.ReactTestRendererJSON;

  expect(tree.props.className).toEqual(expect.stringContaining("right-3"));
});

test("Twined is inheritable.", () => {
  const component = renderer.create(<Close right={3}>Close</Close>);
  const tree = component.toJSON() as renderer.ReactTestRendererJSON;

  expect(tree.props.className).toEqual(
    expect.stringContaining("border-0 px-6 py-2 rounded-lg")
  );
});
