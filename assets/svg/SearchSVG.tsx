import * as React from 'react';
import { Svg, Path } from 'react-native-svg';
import { memo } from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="19"
      fill="none"
      viewBox="0 0 18 19"
      {...props}
    >
      <Path
        fill="#6B6B6B"
        d="M16.72 18.351a.75.75 0 101.06-1.06l-1.06 1.06zM13.588 8.115a6.044 6.044 0 01-6.044 6.044v1.5a7.544 7.544 0 007.544-7.544h-1.5zm-6.044 6.044A6.044 6.044 0 011.5 8.115H0a7.544 7.544 0 007.544 7.544v-1.5zM1.5 8.115A6.044 6.044 0 017.544 2.07V.57A7.544 7.544 0 000 8.115h1.5zM7.544 2.07a6.044 6.044 0 016.044 6.044h1.5A7.544 7.544 0 007.544.57v1.5zm4.323 11.427l4.853 4.853 1.06-1.06-4.853-4.854-1.06 1.061z"
      ></Path>
    </Svg>
  )
}

const Memo = memo(SvgComponent);
export default Memo;