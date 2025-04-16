import * as React from 'react';
import {Svg, Path, G, Defs, ClipPath} from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
      {...props}>
      <G clipPath="url(#clip0_4999_4731)">
        <Path
          fill="#F9C01B"
          d="M5.5 9.34l3.708 2.16-.984-4.07L11.5 4.692l-4.314-.354L5.5.5 3.814 4.338-.5 4.692 2.776 7.43l-.984 4.07L5.5 9.34z"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4999_4731">
          <Path fill="#fff" d="M0 0H12V12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

const Memo = memo(SvgComponent);
export default Memo;
