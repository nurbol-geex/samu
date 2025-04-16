import * as React from 'react';
import {Svg, Path} from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="12"
      fill="none"
      viewBox="0 0 16 12"
      {...props}>
      <Path
        stroke="#189E56"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
        d="M15 6l-5-5m5 5l-5 5m5-5H1"
      />
    </Svg>
  );
};

const Memo = memo(SvgComponent);
export default Memo;
