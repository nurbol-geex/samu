import * as React from 'react';
import Svg, {Rect, Defs, LinearGradient, Stop} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={343}
    height={39}
    fill="none"
    {...props}>
    <Rect
      width={343}
      height={38}
      y={0.571}
      fill="url(#a)"
      fillOpacity={0.69}
      rx={19}
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={288.363}
        x2={28.724}
        y1={51.735}
        y2={16.939}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#006B31" />
        <Stop offset={1} stopColor="#18534F" />
      </LinearGradient>
    </Defs>
  </Svg>
);

const Memo = React.memo(SvgComponent);
export default Memo;
