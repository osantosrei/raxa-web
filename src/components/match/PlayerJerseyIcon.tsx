import { cn } from "@/lib/utils";

interface PlayerJerseyIconProps {
  number: number;
  tone: "blue" | "red" | "yellow" | "neutral";
}

const TONE_CLASSES = {
  blue: {
    fill: "fill-blue-500/20",
    stroke: "stroke-blue-400",
    text: "fill-blue-100",
  },
  red: {
    fill: "fill-red-500/20",
    stroke: "stroke-red-400",
    text: "fill-red-100",
  },
  yellow: {
    fill: "fill-yellow-500/20",
    stroke: "stroke-yellow-300",
    text: "fill-yellow-100",
  },
  neutral: {
    fill: "fill-surface-high",
    stroke: "stroke-muted",
    text: "fill-text",
  },
};

export function PlayerJerseyIcon({ number, tone }: PlayerJerseyIconProps) {
  const classes = TONE_CLASSES[tone];
  const jerseyNumber = String(number).padStart(2, "0").slice(-2);

  return (
    <svg
      viewBox="0 0 36 36"
      className="h-8 w-8 shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12.2 4.8 15.5 7h5l3.3-2.2 7 6.1-4.4 5.3-2.2-1.6v14.6H11.8V14.6l-2.2 1.6-4.4-5.3 7-6.1Z"
        className={cn(classes.fill, classes.stroke)}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="18"
        y="22.5"
        textAnchor="middle"
        className={cn("text-[9px] font-black", classes.text)}
      >
        {jerseyNumber}
      </text>
    </svg>
  );
}
