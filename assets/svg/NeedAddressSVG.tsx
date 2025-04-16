import React, {memo} from 'react';
import {View} from 'react-native';
import Svg, {Rect, Path, G, LinearGradient, Stop, Defs} from 'react-native-svg';

const NeedAddressSVG: React.FC<ISvgProps> = ({style, ...props}) => {
  return (
    <View style={style}>
      <Svg
        width="229"
        height="228"
        viewBox="0 0 229 228"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <Rect
          x="0.5"
          width="228"
          height="228"
          rx="114"
          fill="url(#paint0_linear_7592_7638)"
          fillOpacity="0.05"
        />
        <Rect
          x="32.5"
          y="32"
          width="164"
          height="164"
          rx="82"
          fill="#189E56"
          fillOpacity="0.15"
        />
        <Rect
          x="64.5"
          y="64"
          width="100"
          height="100"
          rx="47"
          fill="#189E56"
          fillOpacity="0.1"
        />
        <G>
          <Path
            d="M114.5 82.1133C107.444 82.121 100.679 84.9273 95.689 89.9166C90.6992 94.9058 87.8923 101.67 87.8838 108.727C87.8838 115.58 93.1905 126.305 103.657 140.604C104.903 142.311 106.535 143.7 108.419 144.657C110.303 145.614 112.386 146.113 114.5 146.113C116.613 146.113 118.697 145.614 120.581 144.657C122.465 143.7 124.096 142.311 125.342 140.604C135.809 126.305 141.116 115.58 141.116 108.727C141.107 101.67 138.3 94.9058 133.311 89.9166C128.321 84.9273 121.556 82.121 114.5 82.1133ZM114.5 119.335C112.39 119.335 110.328 118.709 108.574 117.537C106.82 116.365 105.452 114.699 104.645 112.75C103.838 110.801 103.627 108.656 104.038 106.587C104.45 104.518 105.466 102.617 106.957 101.125C108.449 99.6337 110.35 98.6178 112.419 98.2062C114.488 97.7947 116.633 98.0059 118.582 98.8132C120.531 99.6206 122.197 100.988 123.369 102.742C124.541 104.496 125.166 106.558 125.166 108.668C125.166 111.497 124.043 114.21 122.042 116.21C120.042 118.211 117.329 119.335 114.5 119.335Z"
            fill="url(#paint1_linear_7592_7638)"
          />
        </G>
        <Defs>
          <LinearGradient
            id="paint0_linear_7592_7638"
            x1="99.604"
            y1="36.1463"
            x2="182.871"
            y2="215.622"
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#189E56" />
            <Stop offset="1" stopColor="#008C5A" />
          </LinearGradient>
          <LinearGradient
            id="paint1_linear_7592_7638"
            x1="111.022"
            y1="92.2596"
            x2="137.068"
            y2="138.954"
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#189E56" />
            <Stop offset="1" stopColor="#008C5A" />
          </LinearGradient>
        </Defs>
      </Svg>
    </View>
  );
};

export default memo(NeedAddressSVG);
