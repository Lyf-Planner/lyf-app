import * as React from 'react'

import Svg, { Path, SvgProps } from 'react-native-svg'

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      fill={props.color || 'black'}
      viewBox="0 0 32 32"
      {...props}
    >
      <Path d="M28.25 15H8.21c-.55 0-1 .45-1 1s.45 1 1 1h20.05c.55 0 1-.45 1-1s-.45-1-1-1h-.01zM25.62 24.69H11.69c-.55 0-1 .45-1 1s.45 1 1 1h13.93c.55 0 1-.45 1-1s-.45-1-1-1zM11.69 7.39h8.56c.55 0 1-.45 1-1s-.45-1-1-1h-8.56c-.55 0-1 .45-1 1s.45 1 1 1zM21.35 21.27c0-.55-.45-1-1-1H3.78c-.55 0-1 .45-1 1s.45 1 1 1h16.56c.55 0 1-.45 1-1h.01zM3.78 11.72h19.76c.55 0 1-.45 1-1s-.45-1-1-1H3.78c-.55 0-1 .45-1 1s.45 1 1 1z" />
    </Svg>
  )
}

export default SvgComponent
