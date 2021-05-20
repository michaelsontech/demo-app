import * as React from "react"
import Svg, { LinearGradient, Stop, Path } from "react-native-svg"

function ErrorIcon(props) {
  return (
    <Svg
      height={props.size}
      viewBox="0 0 512 512"
      width={props.size}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <LinearGradient
        id="prefix__b"
        gradientUnits="userSpaceOnUse"
        x1={256}
        x2={256}
        y1={512}
        y2={0}
      >
        <Stop offset={0} stopColor="#fd3a84" />
        <Stop offset={1} stopColor="#ffa68d" />
      </LinearGradient>
      <LinearGradient id="prefix__a">
        <Stop offset={0} stopColor="#ffc2cc" />
        <Stop offset={1} stopColor="#fff2f4" />
      </LinearGradient>
      <LinearGradient
        id="prefix__c"
        gradientUnits="userSpaceOnUse"
        x1={256}
        x2={256}
        xlinkHref="#prefix__a"
        y1={301}
        y2={91}
      />
      <LinearGradient
        id="prefix__d"
        gradientUnits="userSpaceOnUse"
        x1={256}
        x2={256}
        xlinkHref="#prefix__a"
        y1={421}
        y2={331}
      />
      <Path
        d="M355.826 512H156.175c-3.979 0-7.794-1.58-10.606-4.394L4.394 366.432A14.996 14.996 0 010 355.826V156.174c0-3.978 1.58-7.793 4.394-10.606L145.568 4.394A14.996 14.996 0 01156.175 0h199.651c3.979 0 7.794 1.581 10.606 4.394l141.174 141.174A15 15 0 01512 156.174v199.651c0 3.978-1.58 7.793-4.394 10.606L366.433 507.606A15 15 0 01355.826 512z"
        fill="url(#prefix__b)"
      />
      <Path
        d="M256 301c-24.813 0-45-20.187-45-45V136c0-24.813 20.187-45 45-45s45 20.187 45 45v120c0 24.813-20.187 45-45 45z"
        fill="url(#prefix__c)"
      />
      <Path
        d="M256 421c-24.813 0-45-20.187-45-45s20.187-45 45-45 45 20.187 45 45-20.187 45-45 45z"
        fill="url(#prefix__d)"
      />
    </Svg>
  )
}

export default ErrorIcon
