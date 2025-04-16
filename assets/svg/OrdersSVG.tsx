import * as React from 'react';
import { Svg, Mask, Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask
      id="mask0_1380_9970"
      style={{ maskType: 'luminance' }}
      maskUnits="userSpaceOnUse"
      x={1}
      y={1}
      width={22}
      height={22}
    >
      <Path
        d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z"
        fill="white"
        stroke="white"
        strokeWidth={1.77778}
        strokeLinejoin="round"
      />
      <Path
        d="M12.0039 6V12.005L16.2434 16.245"
        stroke="black"
        strokeWidth={1.77778}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Mask>
    <G mask="url(#mask0_1380_9970)"></G>
    <G clipPath="url(#clip0_1380_9970)">
      <Path
        d="M14.4549 11.6328C13.969 11.9094 13.4392 12.1006 12.8887 12.1981V22.5546C13.3571 22.4634 13.8075 22.2961 14.222 22.0595L19.5793 18.967C20.2541 18.5758 20.8145 18.0144 21.2044 17.3388C21.5943 16.6633 21.8002 15.8973 21.8015 15.1173V8.93059C21.7987 8.45575 21.7192 7.9845 21.566 7.53503L14.4549 11.6328Z"
        fill="#0C513F"
      />
      <Path
        d="M10.4376 10.0951C10.9136 10.3689 11.4532 10.513 12.0024 10.513C12.5517 10.513 13.0913 10.3689 13.5673 10.0951L20.6784 5.9973C20.3635 5.63541 19.9918 5.3271 19.578 5.08441L14.2224 1.98841C13.5464 1.59963 12.7801 1.39502 12.0002 1.39502C11.2203 1.39502 10.4541 1.59963 9.778 1.98841L4.42067 5.08174C4.02161 5.31542 3.66168 5.61027 3.354 5.95552L10.4376 10.0951Z"
        fill="#0C513F"
      />
      <Path
        d="M11.1111 12.1984C10.5602 12.1011 10.0301 11.9099 9.54402 11.6331L2.45069 7.4873C2.28653 7.95102 2.2012 8.43896 2.19824 8.93086V15.1175C2.19954 15.8975 2.40544 16.6636 2.79539 17.3391C3.18533 18.0146 3.74568 18.5761 4.42046 18.9673L9.7778 22.0597C10.1923 22.2964 10.6427 22.4637 11.1111 22.5549V12.1984Z"
        fill="#0C513F"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_1380_9970">
        <Rect
          width={21.3333}
          height={21.3333}
          fill="white"
          transform="translate(1.3335 1.33337)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);

const Memo = memo(SvgComponent);
export default Memo;