import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  <Svg
    width="12"
    height="12"
    viewBox="0 0 12 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M10.2428 1.32803L1.75766 9.8132M10.2428 9.8132L1.75766 1.32803"
      stroke="#0C513F"
      stroke-width="1.92855"
      stroke-linecap="round"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
