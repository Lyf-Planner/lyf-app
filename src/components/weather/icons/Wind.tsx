import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      fill={props.color || 'black'}
      viewBox="0 0 32 32"
      {...props}
    >
      <Path d="M24.78 6.02c-2.45 0-4.44 1.99-4.44 4.44 0 .54.44.98.98.98s.98-.44.98-.98a2.48 2.48 0 112.48 2.48H3.66c-.54 0-.98.44-.98.98s.44.98.98.98h21.12c2.45 0 4.44-1.99 4.44-4.44s-1.99-4.44-4.44-4.44zM18.79 16.88H6.31c-.55 0-1 .45-1 1s.45 1 1 1h12.47c1.4 0 2.55 1.14 2.55 2.55s-1.14 2.55-2.55 2.55-2.55-1.14-2.55-2.55c0-.55-.45-1-1-1s-1 .45-1 1c0 2.51 2.04 4.55 4.55 4.55s4.55-2.04 4.55-4.55-2.04-4.55-4.55-4.55h.01z" />
      <Path d="M6.3 10.95h8.71c.55 0 1-.45 1-1s-.45-1-1-1H6.3c-.55 0-1 .45-1 1s.45 1 1 1z" />
    </Svg>
  )
}

export default SvgComponent
