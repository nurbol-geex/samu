import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}>
    <Path fill="#fff" d="M.5 0h24v24H.5z" />
    <Path
      fill="#4285F4"
      d="M23.54 12.261c0-.815-.073-1.6-.21-2.352H12.5v4.448h6.19a5.29 5.29 0 0 1-2.296 3.471v2.886h3.717c2.174-2.002 3.429-4.95 3.429-8.453z"
    />
    <Path
      fill="#34A853"
      d="M12.5 23.5c3.105 0 5.708-1.03 7.61-2.786l-3.716-2.886c-1.03.69-2.347 1.098-3.894 1.098-2.995 0-5.53-2.023-6.435-4.741H2.223v2.98A11.496 11.496 0 0 0 12.5 23.5z"
    />
    <Path
      fill="#FBBC05"
      d="M6.065 14.185A6.913 6.913 0 0 1 5.705 12c0-.758.13-1.495.36-2.185v-2.98H2.223A11.495 11.495 0 0 0 1 12c0 1.856.444 3.612 1.223 5.165l3.842-2.98z"
    />
    <Path
      fill="#B10000"
      d="M12.5 5.074c1.688 0 3.204.58 4.396 1.72l3.299-3.299C18.203 1.64 15.6.5 12.5.5A11.496 11.496 0 0 0 2.223 6.835l3.842 2.98c.905-2.718 3.44-4.741 6.435-4.741z"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
