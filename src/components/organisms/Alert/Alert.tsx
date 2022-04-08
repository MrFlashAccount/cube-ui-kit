import { forwardRef } from 'react';
import THEMES from '../../../data/themes';
import { CONTAINER_STYLES, TEXT_STYLES } from '../../../styles/list';
import { extractStyles } from '../../../utils/styles';
import { filterBaseProps } from '../../../utils/filterBaseProps';
import { BaseProps, ContainerStyleProps, TextStyleProps } from '../../types';
import { styled } from '../../../styled';

const RawAlert = styled({
  name: 'Alert',
  styles: {
    display: 'block',
    flow: 'column',
    radius: '1r',
    padding: '1.5x',
    preset: 't3',
    color: {
      '': '#dark',
      '[data-type="disabled"]': THEMES.disabled.color,
    },
    fill: {
      '': '#clear',
      ...Object.keys(THEMES).reduce((map, type) => {
        map[`[data-type="${type}"]`] = THEMES[type].fill;

        return map;
      }, {}),
    },
    border: {
      '': '#clear',
      ...Object.keys(THEMES).reduce((map, type) => {
        map[`[data-type="${type}"]`] = THEMES[type].border;

        return map;
      }, {}),
    },
  },
  props: {
    role: 'alert',
    qa: 'Alert',
  },
});

const STYLE_LIST = [...CONTAINER_STYLES, ...TEXT_STYLES] as const;

export interface CubeAlertProps
  extends BaseProps,
    ContainerStyleProps,
    TextStyleProps {
  type?: keyof typeof THEMES;
  label?: string;
}

export const Alert = forwardRef((allProps: CubeAlertProps, ref) => {
  let { type, label, isDisabled, ...props } = allProps;

  type = isDisabled ? 'disabled' : type || 'note';

  const styles = extractStyles(props, STYLE_LIST);

  return (
    <RawAlert
      {...filterBaseProps(props, { eventProps: true })}
      data-type={type}
      styles={styles}
      ref={ref}
    />
  );
});
