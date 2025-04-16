import * as React from 'react';
import { Svg, Path } from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M7 2.333v9.334M11.667 7H2.333"
      ></Path>
    </Svg>
  )
}

const Memo = memo(SvgComponent);
export default Memo;