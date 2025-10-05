import React from "react";

interface IconProps {
  name: string | "binanceSmart" | "ethereum" | "polygon";
  size?: number;
  className?: string;
}

const icons = {
  BNB: {
    viewBox: "0 0 2496 2496",
    content: (
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#F0B90B"
          d="M1248,0c689.3,0,1248,558.7,1248,1248s-558.7,1248-1248,1248
          S0,1937.3,0,1248S558.7,0,1248,0L1248,0z"
        />
        <path
          fill="#FFFFFF"
          d="M685.9,1248l0.9,330l280.4,165v193.2l-444.5-260.7v-524L685.9,1248L685.9,1248z M685.9,918v192.3
          l-163.3-96.6V821.4l163.3-96.6l164.1,96.6L685.9,918L685.9,918z M1084.3,821.4l163.3-96.6l164.1,96.6L1247.6,918L1084.3,821.4
          L1084.3,821.4z"
        />
        <path
          fill="#FFFFFF"
          d="M803.9,1509.6v-193.2l163.3,96.6v192.3L803.9,1509.6L803.9,1509.6z M1084.3,1812.2l163.3,96.6
          l164.1-96.6v192.3l-164.1,96.6l-163.3-96.6V1812.2L1084.3,1812.2z M1645.9,821.4l163.3-96.6l164.1,96.6v192.3l-164.1,96.6V918
          L1645.9,821.4L1645.9,821.4L1645.9,821.4z M1809.2,1578l0.9-330l163.3-96.6v524l-444.5,260.7v-193.2L1809.2,1578L1809.2,1578
          L1809.2,1578z"
        />
        <polygon
          fill="#FFFFFF"
          points="1692.1,1509.6 1528.8,1605.3 1528.8,1413 1692.1,1316.4 1692.1,1509.6"
        />
        <path
          fill="#FFFFFF"
          d="M1692.1,986.4l0.9,193.2l-281.2,165v330.8l-163.3,95.7l-163.3-95.7v-330.8l-281.2-165V986.4
          L968,889.8l279.5,165.8l281.2-165.8l164.1,96.6H1692.1L1692.1,986.4z M803.9,656.5l443.7-261.6l444.5,261.6l-163.3,96.6
          l-281.2-165.8L967.2,753.1L803.9,656.5L803.9,656.5z"
        />
      </g>
    ),
  },
  ETH: {
    viewBox: "0 0 784.37 1277.39",
    content: (
      <g>
        <polygon
          fill="#343434"
          fillRule="nonzero"
          points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"
        />
        <polygon
          fill="#8C8C8C"
          fillRule="nonzero"
          points="392.07,0 0,650.54 392.07,882.29 392.07,472.33"
        />
        <polygon
          fill="#3C3C3B"
          fillRule="nonzero"
          points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"
        />
        <polygon
          fill="#8C8C8C"
          fillRule="nonzero"
          points="392.07,1277.38 392.07,956.52 0,724.89"
        />
        <polygon
          fill="#141414"
          fillRule="nonzero"
          points="392.07,882.29 784.13,650.54 392.07,472.33"
        />
        <polygon
          fill="#393939"
          fillRule="nonzero"
          points="0,650.54 392.07,882.29 392.07,472.33"
        />
      </g>
    ),
  },
  MATIC: {
    viewBox: "0 0 178 161",
    content: (
      <path
        fill="#6C00F6"
        d="M66.8,54.7l-16.7-9.7L0,74.1v58l50.1,29l50.1-29V41.9L128,25.8l27.8,16.1v32.2L128,90.2l-16.7-9.7v25.8
        l16.7,9.7l50.1-29V29L128,0L77.9,29v90.2l-27.8,16.1l-27.8-16.1V86.9l27.8-16.1l16.7,9.7V54.7z"
      />
    ),
  },
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = "",
}) => {
  const iconData = icons[name as keyof typeof icons];

  if (!iconData) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={iconData.viewBox}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {iconData.content}
    </svg>
  );
};

export default Icon;
