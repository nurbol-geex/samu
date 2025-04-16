import * as React from 'react';
import {Svg, Path} from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => {
  return (
    <Svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8.08517 15.0071C9.81607 15.0094 11.494 14.4105 12.8324 13.3129L17.3088 17.7885C17.6069 18.0764 18.0818 18.0681 18.3697 17.77C18.6505 17.4793 18.6505 17.0183 18.3697 16.7275L13.8941 12.2512C16.5159 9.04222 16.0399 4.31538 12.8309 1.69356C9.62193 -0.928257 4.89509 -0.452253 2.27327 2.75674C-0.348545 5.96574 0.127459 10.6925 3.33646 13.3144C4.67675 14.4094 6.35441 15.0075 8.08517 15.0071Z"
        fill="white"
      />
    </Svg>
  );
};

const Memo = memo(SvgComponent);
export default Memo;
