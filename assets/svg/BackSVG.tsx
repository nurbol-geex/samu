import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => (
  <Svg
    width="40"
    height="32"
    viewBox="0 0 40 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M18.9609 16.2309C18.9186 16.1887 18.885 16.1386 18.8621 16.0833C18.8391 16.0281 18.8273 15.9689 18.8273 15.9091C18.8273 15.8493 18.8391 15.7901 18.8621 15.7349C18.885 15.6797 18.9186 15.6295 18.9609 15.5873L23.13 11.4191C23.3858 11.1634 23.5295 10.8166 23.5296 10.4549C23.5297 10.0932 23.3861 9.74629 23.1304 9.49048C22.8747 9.23467 22.5279 9.09091 22.1662 9.09082C21.8045 9.09074 21.4576 9.23433 21.2018 9.49003L17.0327 13.6591C16.437 14.2564 16.1025 15.0656 16.1025 15.9091C16.1025 16.7527 16.437 17.5618 17.0327 18.1591L21.2018 22.3282C21.4576 22.5839 21.8045 22.7275 22.1662 22.7274C22.5279 22.7273 22.8747 22.5836 23.1304 22.3278C23.3861 22.0719 23.5297 21.725 23.5296 21.3633C23.5295 21.0017 23.3858 20.6548 23.13 20.3991L18.9609 16.2309Z"
      fill="white"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
