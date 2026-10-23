import type { ComponentProperties } from './base';
import { BaseComponent } from './base';

type UtilityTagProperties<K extends keyof HTMLElementTagNameMap = 'div'> = Omit<
  ComponentProperties<K>,
  'elementTag'
>;

const a = (
  properties: UtilityTagProperties<'a'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'a'> =>
  new BaseComponent<'a'>({ ...properties, elementTag: 'a' }, ...children);

const aside = (
  properties: UtilityTagProperties<'aside'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'aside'> =>
  new BaseComponent<'aside'>(
    { ...properties, elementTag: 'aside' },
    ...children,
  );

const button = (
  properties: UtilityTagProperties<'button'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'button'> =>
  new BaseComponent<'button'>(
    { ...properties, elementTag: 'button' },
    ...children,
  );

const datalist = (
  properties: UtilityTagProperties<'datalist'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'datalist'> =>
  new BaseComponent<'datalist'>(
    { ...properties, elementTag: 'datalist' },
    ...children,
  );

const details = (
  properties: UtilityTagProperties<'details'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'details'> =>
  new BaseComponent<'details'>(
    { ...properties, elementTag: 'details' },
    ...children,
  );

const div = (
  properties: UtilityTagProperties,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'div'> =>
  new BaseComponent<'div'>({ ...properties, elementTag: 'div' }, ...children);

const form = (
  properties: UtilityTagProperties<'form'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'form'> =>
  new BaseComponent<'form'>({ ...properties, elementTag: 'form' }, ...children);

const h1 = (
  properties: UtilityTagProperties<'h1'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'h1'> =>
  new BaseComponent({ ...properties, elementTag: 'h1' }, ...children);

const header = (
  properties: UtilityTagProperties<'header'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'header'> =>
  new BaseComponent({ ...properties, elementTag: 'header' }, ...children);

const img = (properties: UtilityTagProperties<'img'>): BaseComponent<'img'> =>
  new BaseComponent<'img'>({ ...properties, elementTag: 'img' });

const input = (
  properties: UtilityTagProperties<'input'>,
): BaseComponent<'input'> =>
  new BaseComponent<'input'>({ ...properties, elementTag: 'input' });

const label = (
  properties: UtilityTagProperties<'label'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'label'> =>
  new BaseComponent<'label'>(
    { ...properties, elementTag: 'label' },
    ...children,
  );

const li = (
  properties: UtilityTagProperties<'li'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'li'> =>
  new BaseComponent<'li'>({ ...properties, elementTag: 'li' }, ...children);

const option = (
  properties: UtilityTagProperties<'option'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'option'> =>
  new BaseComponent<'option'>(
    { ...properties, elementTag: 'option' },
    ...children,
  );

const p = (
  properties: UtilityTagProperties<'p'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'p'> =>
  new BaseComponent<'p'>({ ...properties, elementTag: 'p' }, ...children);

const select = (
  properties: UtilityTagProperties<'select'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'select'> =>
  new BaseComponent<'select'>(
    { ...properties, elementTag: 'select' },
    ...children,
  );

const selectedcontent = (
  // @ts-expect-error
  properties: UtilityTagProperties<'selectedcontent'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
  //@ts-expect-error
): BaseComponent<'selectedcontent'> =>
  //@ts-expect-error
  new BaseComponent<'selectedcontent'>(
    { ...properties, elementTag: 'selectedcontent' },
    ...children,
  );

const span = (
  properties: UtilityTagProperties<'span'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'span'> =>
  new BaseComponent<'span'>({ ...properties, elementTag: 'span' }, ...children);

const summary = (
  properties: UtilityTagProperties<'summary'>,
): BaseComponent<'summary'> =>
  new BaseComponent<'summary'>({ ...properties, elementTag: 'summary' });

const textarea = (
  properties: UtilityTagProperties<'textarea'>,
): BaseComponent<'textarea'> =>
  new BaseComponent<'textarea'>({ ...properties, elementTag: 'textarea' });

const ul = (
  properties: UtilityTagProperties<'ul'>,
  ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
): BaseComponent<'ul'> =>
  new BaseComponent<'ul'>({ ...properties, elementTag: 'ul' }, ...children);

export {
  a,
  aside,
  button,
  datalist,
  details,
  div,
  form,
  h1,
  header,
  img,
  input,
  label,
  li,
  option,
  p,
  select,
  selectedcontent,
  span,
  summary,
  textarea,
  ul,
};
