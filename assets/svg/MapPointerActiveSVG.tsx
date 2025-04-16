import * as React from 'react';
import { Svg, Path, G, Defs, ClipPath } from 'react-native-svg';
import { memo } from 'react';
import { ISvgProps } from '../../src/types/svg.types'; // make sure the path to the types is 

const SvgComponent = (props: ISvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      fill="none"
      viewBox="0 0 14 15"
      {...props}
    >
      <G clipPath="url(#clip0_3728_10660)">
        <Path
          fill="#fff"
          d="M7 .595a5.829 5.829 0 00-5.822 5.822c0 1.5 1.16 3.845 3.45 6.973a2.936 2.936 0 004.744 0c2.29-3.128 3.45-5.474 3.45-6.973A5.828 5.828 0 007 .595zm0 8.143A2.333 2.333 0 117 4.07a2.333 2.333 0 010 4.667z"
        ></Path>
      </G>
      <Defs>
        <ClipPath id="clip0_3728_10660">
          <Path
            fill="#fff"
            d="M0 0H14V14H0z"
            transform="translate(0 .57)"
          ></Path>
        </ClipPath>
      </Defs>
    </Svg>
  )
}

const Memo = memo(SvgComponent);
export default Memo;