import * as React from 'react';
import {Svg, Path} from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      fill="none"
      viewBox="0 0 14 15"
      {...props}>
      <Path
        fill="#189E56"
        d="M7 3.213A5.064 5.064 0 001.942 8.27c0 2.788 2.27 5.063 5.058 5.063a5.064 5.064 0 005.057-5.057c0-2.788-2.269-5.063-5.057-5.063zm.438 4.87A.44.44 0 017 8.521a.44.44 0 01-.438-.438V5.167A.44.44 0 017 4.729a.44.44 0 01.438.438v2.916zM8.686 2.512H5.314a.423.423 0 010-.846h3.372a.423.423 0 010 .846z"
      />
    </Svg>
  );
};

const Memo = memo(SvgComponent);
export default Memo;
