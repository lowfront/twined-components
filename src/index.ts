import * as React from 'react'
import {ComponentType} from 'react';
import domElements from './dom-elements';
import _styled from 'styled-components';

type TemplateLiteralArrayClone = Array<any> & {raw: Array<any>;};
export type CSSStylePartial = Partial<Record<keyof CSSStyleDeclaration, unknown>>;
export type litComponentFunction = ((scArray: TemplateStringsArray, ...scStrs: any[]) => ComponentType<any> | ((params: React.CSSProperties) => ComponentType<any>));
export type StyledStyle = {
  css: litComponentFunction;
};

const isTemplateLiterals = (vararg: any) => 
  Array.isArray(vararg[0]) &&
  Array.isArray((<TemplateLiteralArrayClone>vararg[0]).raw) &&
  vararg[0].length === (<TemplateLiteralArrayClone>vararg[0]).raw.length &&
  vararg[0].every((item, i) => item === vararg[0].raw[i]);

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
    css(...params: any[]) {
      if (isTemplateLiterals(params)) {
        const [scArray, ...scStrs]: [TemplateStringsArray, any[]] = <[TemplateStringsArray, any[]]>params;
        return styledComponent(scArray, ...scStrs);
      } else {
        return styledComponent(params[0]);
      }
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
