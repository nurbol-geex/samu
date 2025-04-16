import React, { memo } from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  <Svg
    width={22}
    height={21}
    viewBox="0 0 22 21"
    fill="none"
    {...props}
  >
    <G clipPath="url(#clip0_3728_9940)">
      <Path
        d="M10.875 13.1178C9.42526 13.1178 8.25 14.2931 8.25 15.7428V20.9928H13.5V15.7428C13.5 14.2931 12.3247 13.1178 10.875 13.1178Z"
        fill="#0C513F"
      />
      <Path
        d="M15.25 15.7432V20.9932H18.75C20.1997 20.9932 21.375 19.8179 21.375 18.3682V10.3873C21.3752 9.93274 21.1986 9.49593 20.8824 9.16932L13.4466 1.13067C12.1346 -0.288884 9.92028 -0.376042 8.50073 0.935965C8.4333 0.998309 8.36833 1.06324 8.30603 1.13067L0.883389 9.16669C0.557643 9.49465 0.374877 9.9382 0.375 10.4004V18.3682C0.375 19.8179 1.55026 20.9932 3 20.9932H6.49999V15.7432C6.51635 13.3572 8.44273 11.4088 10.7686 11.3527C13.1723 11.2947 15.2317 13.2763 15.25 15.7432Z"
        fill="#0C513F"
      />
      <Path
        d="M10.875 13.1178C9.42526 13.1178 8.25 14.2931 8.25 15.7428V20.9928H13.5V15.7428C13.5 14.2931 12.3247 13.1178 10.875 13.1178Z"
        fill="#0C513F"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_3728_9940">
        <Rect width={21} height={21} fill="white" transform="translate(0.375)" />
      </ClipPath>
    </Defs>
  </Svg>
);

const Memo = memo(SvgComponent);
export default Memo;