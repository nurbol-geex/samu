import * as React from 'react';
import Svg, {Path, G, Mask} from 'react-native-svg';
import {memo} from 'react';
import {ISvgProps} from '../../src/types/svg.types';

const SvgComponent = (props: ISvgProps) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 28 28"
      {...props}
    >
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M24.21 25.596h-8.463a.875.875 0 010-1.75h8.462a.875.875 0 010 1.75z"
        clipRule="evenodd"
      ></Path>
      <Mask
        id="mask0_6976_9271"
        style={{ maskType: "luminance" }}
        width="21"
        height="23"
        x="2"
        y="3"
        maskUnits="userSpaceOnUse"
      >
        <Path
          fill="#fff"
          fillRule="evenodd"
          d="M2.334 3.5h20.044v22.096H2.334V3.5z"
          clipRule="evenodd"
        ></Path>
      </Mask>
      <G mask="url(#mask0_6976_9271)">
        <Path
          fill="#fff"
          fillRule="evenodd"
          d="M15.296 5.853L4.312 19.59c-.2.25-.273.572-.2.881l.795 3.366 3.545-.044c.337-.004.649-.154.855-.41C13.06 18.685 20.216 9.732 20.42 9.47c.19-.31.266-.75.165-1.172a1.646 1.646 0 00-.76-1.034 382.815 382.815 0 01-2.11-1.631c-.74-.593-1.819-.49-2.418.219zM4.216 25.597a.876.876 0 01-.852-.674l-.955-4.05a2.767 2.767 0 01.536-2.376l10.99-13.745.013-.016c1.205-1.44 3.385-1.653 4.855-.473l2.01 1.562c.71.422 1.263 1.177 1.473 2.07a3.34 3.34 0 01-.429 2.569c-.036.057-.068.106-11.184 14.013a2.854 2.854 0 01-2.2 1.066l-4.245.053h-.012z"
          clipRule="evenodd"
        ></Path>
      </G>
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M18.927 13.632a.878.878 0 01-.533-.18l-6.36-4.887a.876.876 0 01-.162-1.227.876.876 0 011.228-.16l6.362 4.885a.875.875 0 01-.535 1.57z"
        clipRule="evenodd"
      ></Path>
    </Svg>
  )
}

const Memo = memo(SvgComponent);
export default Memo;