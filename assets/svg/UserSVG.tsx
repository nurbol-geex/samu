import * as React from 'react';
import { Svg, Path } from 'react-native-svg';
import { memo } from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  <Svg
    width={22}
    height={21}
    viewBox="0 0 22 21"
    fill="none"
    {...props}
  >
    <Path
      d="M11.125 10.5C14.0245 10.5 16.375 8.1495 16.375 5.25C16.375 2.3505 14.0245 0 11.125 0C8.2255 0 5.875 2.3505 5.875 5.25C5.875 8.1495 8.2255 10.5 11.125 10.5Z"
      fill="#0C513F"
    />
    <Path
      d="M11.125 12.2492C6.77775 12.254 3.25484 15.777 3.25 20.1242C3.25 20.6075 3.64174 20.9992 4.12499 20.9992H18.125C18.6082 20.9992 19 20.6075 19 20.1242C18.9952 15.777 15.4722 12.254 11.125 12.2492Z"
      fill="#0C513F"
    />
  </Svg>
);

const Memo = memo(SvgComponent);
export default Memo;