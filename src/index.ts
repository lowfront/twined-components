import * as React from 'react'
import {ComponentType} from 'react';
import domElements from './dom-elements';
import _styled from 'styled-components';

export type litComponentFunction = (scArray: TemplateStringsArray, ...scStrs: any[]) => ComponentType<any>;
export type StyledStyle = {
  css: litComponentFunction;
};

const falsyToEmptyString = (val: any) => (val === undefined || val === false || Number.isNaN(val) || val === null) ? '' : val;

const litComponentFactory = <T extends (keyof JSX.IntrinsicElements)>(el: T|ComponentType) => (array: TemplateStringsArray, ...strs: any[]): ComponentType<any> & StyledStyle => {
  const targetStyled: any = typeof el === 'string' ? (_styled as any)[el] : _styled(el);

  const styledComponent: litComponentFunction = targetStyled.attrs((props: any) => {  
    const copyStrs = [...strs];
    const classNames = array.reduce((acc, val) => {
      const strProp = copyStrs.shift();
      const resultSProp = typeof strProp === 'function' ? falsyToEmptyString(strProp(props)) : strProp;
      return acc += (val + (resultSProp || ''));
    }, '').replace(/\n/g, ' ').replace(/[\t \r]{2,}/g, ' ').trim();

    return {className: classNames};
  });
  
  return Object.assign((styledComponent`` as unknown) as ComponentType, {
    css(scArray: TemplateStringsArray, ...scStrs: any[]) {
      return styledComponent(scArray, ...scStrs);
    },
  });
};


export type JSXElements = {
  [key in keyof JSX.IntrinsicElements]: (array: TemplateStringsArray, ...strs: any[]) => ComponentType<any> & StyledStyle;
};

const twinedElements = domElements.reduce((acc, domElement) => {
  acc[domElement] = litComponentFactory(domElement);
  return acc;
}, {} as JSXElements);

const twined = Object.assign(litComponentFactory, twinedElements);
export default twined;
