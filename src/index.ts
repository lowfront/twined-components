import * as React from "react";
import { ComponentType } from "react";
import domElements from "./dom-elements";
import _styled, {
  AnyStyledComponent,
  CSSObject,
  Interpolation,
  InterpolationFunction,
  InterpolationValue,
  StyledComponent,
  StyledComponentInnerAttrs,
  StyledComponentInnerComponent,
  StyledComponentInnerOtherProps,
  StyledComponentPropsWithRef,
  ThemedStyledFunction,
  ThemedStyledProps,
} from "styled-components";

// Later, it is created in a generic type to obtain a type other than css method.
export type WithCssMethod<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  T extends object,
  O extends object = {},
  A extends keyof any = never
> = StyledComponent<C, T, O, A> & {
  css(
    array:
      | TemplateStringsArray
      | CSSObject
      | InterpolationFunction<
          ThemedStyledProps<StyledComponentPropsWithRef<C> & O, T>
        >,
    ...exps: (string | ((p: O) => InterpolationValue))[]
  ): StyledComponent<C, T, O, A>;
};

// Extracting StyledComponent Types Except for css methods
export type StyledComponentInnerWithCssMethod<T> = T extends WithCssMethod<
  infer C,
  infer T,
  infer O,
  infer A
>
  ? StyledComponent<C, T, O, A>
  : T;

export interface ThemedStyledFunctionBaseForTwined<
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  T extends object,
  O extends object = {},
  A extends keyof any = never
> {
  (
    first:
      | TemplateStringsArray
      | CSSObject
      | InterpolationFunction<
          ThemedStyledProps<StyledComponentPropsWithRef<C> & O, T>
        >,
    ...rest: Array<
      Interpolation<ThemedStyledProps<StyledComponentPropsWithRef<C> & O, T>>
    >
  ): WithCssMethod<C, T, O, A>;
  <U extends object>(
    first:
      | TemplateStringsArray
      | CSSObject
      | InterpolationFunction<
          ThemedStyledProps<StyledComponentPropsWithRef<C> & O & U, T>
        >,
    ...rest: Array<
      Interpolation<
        ThemedStyledProps<StyledComponentPropsWithRef<C> & O & U, T>
      >
    >
  ): WithCssMethod<C, any, O & U, A>;
}

export type ThemedStyledComponentFactoriesForTwined<T extends object> = {
  [TTag in keyof JSX.IntrinsicElements]: ThemedStyledFunctionBaseForTwined<
    TTag,
    T
  >;
};

export interface ThemedBaseStyledInterfaceForTwined<T extends object>
  extends ThemedStyledComponentFactoriesForTwined<T> {
  <C extends AnyStyledComponent>(
    component: C
  ): ThemedStyledFunctionBaseForTwined<
    // Unfortunately, styled doesn't know the css method, can't inherit the type.
    StyledComponentInnerComponent<StyledComponentInnerWithCssMethod<C>>,
    T,
    StyledComponentInnerOtherProps<C>,
    StyledComponentInnerAttrs<C>
  >;
  <C extends keyof JSX.IntrinsicElements | React.ComponentType<any>>(
    component: C
  ): ThemedStyledFunctionBaseForTwined<C, T>;
}

export type TwinedInterface = ThemedBaseStyledInterfaceForTwined<any>;

const isTemplateLiterals = (vararg: any) => {
  const firstArg = vararg[0];
  return Array.isArray(firstArg) && Array.isArray((firstArg as any).raw);
};

const falsyToEmptyString = (val: any) =>
  val === undefined || val === false || Number.isNaN(val) || val === null
    ? ""
    : val;

const litComponentFactory =
  <C extends keyof JSX.IntrinsicElements, T extends object>(
    el: C | ComponentType<any>
  ) =>
  (
    array: TemplateStringsArray,
    ...exps: (string | ((p: T) => InterpolationValue))[]
  ): StyledComponent<
    C,
    any,
    T & {
      className: string;
    },
    "className"
  > => {
    const targetStyled: ThemedStyledFunction<C, any, T, never> =
      typeof el === "string" ? (_styled as any)[el] : _styled(el);

    const styledComponent = targetStyled.attrs((props: any) => {
      const copyExps = [...exps];
      const classNames = array
        .reduce((acc, val) => {
          const prop = copyExps.shift();
          const resultSProp =
            typeof prop === "function" ? falsyToEmptyString(prop(props)) : prop;
          return (acc += val + (resultSProp || ""));
        }, "")
        .replace(/\n/g, " ")
        .replace(/[\t \r]{2,}/g, " ")
        .trim();

      return { className: classNames };
    });

    return Object.assign(styledComponent``, {
      css(...params: any[]) {
        if (isTemplateLiterals(params)) {
          const [scArray, ...scStrs]: [TemplateStringsArray, any[]] = <
            [TemplateStringsArray, any[]]
          >params;
          return styledComponent(scArray, ...scStrs);
        } else {
          return styledComponent(params[0]);
        }
      },
    });
  };

const twinedElements = domElements.reduce((acc, domElement) => {
  acc[domElement] = litComponentFactory(domElement) as any;
  return acc;
}, {} as ThemedStyledComponentFactoriesForTwined<any>);

const twined = Object.assign(
  litComponentFactory,
  twinedElements
) as unknown as TwinedInterface;

export default twined;
