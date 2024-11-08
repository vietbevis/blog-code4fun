import React from "react";

const IconSparkleHeart = ({
  width = 24,
  height = 24,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient
        id="a"
        gradientUnits="userSpaceOnUse"
        x1="15.908"
        x2="15.908"
        y1="3.199"
        y2="28.854"
      >
        <stop offset="0" stopColor="#fd556a" />
        <stop offset="1" stopColor="#aa172a" />
      </linearGradient>
      <linearGradient
        id="b"
        gradientUnits="userSpaceOnUse"
        x1="16.443"
        x2="16.443"
        y1="4.828"
        y2="26.958"
      >
        <stop offset="0" stopColor="#ffdc5d" />
        <stop offset="1" stopColor="#ffcc14" />
      </linearGradient>
      <path
        d="M30.216 11.094a7.894 7.894 0 0 0-7.894-7.895 7.88 7.88 0 0 0-6.414 3.303A7.88 7.88 0 0 0 9.494 3.2 7.894 7.894 0 0 0 1.6 11.094c0 .617.078 1.216.213 1.792 1.096 6.81 8.668 13.996 14.095 15.968 5.426-1.972 13-9.157 14.094-15.967a7.796 7.796 0 0 0 .214-1.793z"
        fill="url(#a)"
      />
      <path
        d="m28.986 20.743-3.06-1.132-1.132-3.06a.8.8 0 0 0-1.501 0L22.16 19.61l-3.06 1.133a.8.8 0 0 0 0 1.5l3.06 1.133 1.133 3.06a.8.8 0 0 0 1.5 0l1.133-3.06 3.06-1.133a.8.8 0 0 0 0-1.5zm-18.4-12.8-1.892-.7-.7-1.892a.8.8 0 0 0-1.501 0l-.701 1.892-1.891.7a.8.8 0 0 0 0 1.5l1.892.7.7 1.892a.8.8 0 0 0 1.5 0l.7-1.892 1.893-.7a.8.8 0 0 0 0-1.5z"
        fill="url(#b)"
      />
    </svg>
  );
};

export default IconSparkleHeart;
