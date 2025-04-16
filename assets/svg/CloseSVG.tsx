import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={32}
    viewBox="-10 -10 32 32"
    fill="none"
    {...props}>
    <Path
      fill="#fff"
      d="M4.667 7.083a.455.455 0 0 1-.098.148l-4.17 4.168a1.364 1.364 0 0 0 1.929 1.93l4.169-4.17a3.36 3.36 0 0 0 .268-.305c.082.106.172.209.268.305l4.169 4.17a1.364 1.364 0 1 0 1.928-1.93L8.961 7.231a.455.455 0 0 1 0-.644l4.17-4.168A1.364 1.364 0 0 0 11.2.49L7.034 4.66a3.186 3.186 0 0 0-.268.305 3.187 3.187 0 0 0-.268-.306L2.327.49A1.364 1.364 0 1 0 .4 2.42l4.17 4.167a.455.455 0 0 1 .098.496z"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
