import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={49}
    fill="none"
    {...props}>
    <G filter="url(#a)">
      <Circle cx={24} cy={24} r={21} fill="#189E56" />
    </G>
    <Path
      fill="#fff"
      d="M23.052 24.322a.455.455 0 0 1 0-.644l4.169-4.168a1.364 1.364 0 0 0-1.928-1.929l-4.17 4.17a3.186 3.186 0 0 0 0 4.5l4.17 4.168a1.364 1.364 0 0 0 1.928-1.929l-4.17-4.168z"
    />
    <Defs />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
