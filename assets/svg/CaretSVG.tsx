import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <Path d="M8.33301 5L12.7438 9.41074C13.0692 9.73618 13.0692 10.2638 12.7438 10.5893L8.33301 15" stroke="#0C513F" stroke-width="2" stroke-linecap="round"/>
    </Svg>
  )
);
const Memo = memo(SvgComponent);
export default Memo;