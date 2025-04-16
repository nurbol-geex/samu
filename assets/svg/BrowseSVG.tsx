import * as React from 'react';
import { Svg, G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
import { memo } from 'react';
import { ISvgProps } from 'src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  <Svg
    width={22}
    height={21}
    viewBox="0 0 22 21"
    fill="none"
    {...props}
  >
    <G clipPath="url(#clip0_3728_9948)">
      <Path
        d="M6.25 0H3.625C1.692 0 0.125 1.567 0.125 3.5V6.125C0.125 8.058 1.692 9.625 3.625 9.625H6.25C8.183 9.625 9.75 8.058 9.75 6.125V3.5C9.75 1.567 8.183 0 6.25 0Z"
        fill="#0C513F"
      />
      <Path
        d="M17.6247 0H14.9998C13.0668 0 11.4998 1.567 11.4998 3.5V6.125C11.4998 8.058 13.0668 9.62501 14.9998 9.62501H17.6247C19.5577 9.62501 21.1247 8.058 21.1247 6.125V3.5C21.1247 1.567 19.5577 0 17.6247 0Z"
        fill="#0C513F"
      />
      <Path
        d="M6.25 11.375H3.625C1.692 11.375 0.125 12.942 0.125 14.875V17.5C0.125 19.433 1.692 21 3.625 21H6.25C8.183 21 9.75 19.433 9.75 17.5V14.875C9.75 12.942 8.183 11.375 6.25 11.375Z"
        fill="#0C513F"
      />
      <Path
        d="M17.6247 11.375H14.9998C13.0668 11.375 11.4998 12.942 11.4998 14.875V17.5C11.4998 19.433 13.0668 21 14.9998 21H17.6247C19.5577 21 21.1247 19.433 21.1247 17.5V14.875C21.1247 12.942 19.5577 11.375 17.6247 11.375Z"
        fill="#0C513F"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_3728_9948">
        <Rect width={21} height={21} fill="white" transform="translate(0.125)" />
      </ClipPath>
    </Defs>
  </Svg>
);

const Memo = memo(SvgComponent);
export default Memo;