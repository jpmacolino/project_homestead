type Topic = "letters" | "numbers" | "shapes" | "colors";

interface TopicHubProps {
  topic: Topic;
  label: string;
  iconPath: string;
  onPress: () => void;
  masteredCount: number;
  totalCount: number;
}

const TOPIC_STYLE: Record<Topic, string> = {
  letters: "bg-amber-50/90 border-amber-200 hover:bg-amber-100/90 focus:ring-amber-400",
  numbers: "bg-sky-50/90 border-sky-200 hover:bg-sky-100/90 focus:ring-sky-400",
  shapes: "bg-emerald-50/90 border-emerald-200 hover:bg-emerald-100/90 focus:ring-emerald-400",
  colors: "bg-rose-50/90 border-rose-200 hover:bg-rose-100/90 focus:ring-rose-400",
};

const LABEL_STYLE: Record<Topic, string> = {
  letters: "text-amber-900",
  numbers: "text-sky-900",
  shapes: "text-emerald-900",
  colors: "text-rose-900",
};

const COUNT_STYLE: Record<Topic, string> = {
  letters: "text-amber-700",
  numbers: "text-sky-700",
  shapes: "text-emerald-700",
  colors: "text-rose-700",
};

export default function TopicHub({
  topic,
  label,
  iconPath,
  onPress,
  masteredCount,
  totalCount,
}: TopicHubProps) {
  return (
    <button
      onClick={onPress}
      aria-label={`${label} — ${masteredCount} of ${totalCount} mastered`}
      className={[
        "flex flex-col items-center justify-center gap-2",
        "min-w-[120px] min-h-[120px] w-40 h-40",
        "rounded-2xl border shadow-md",
        "transition-all duration-150 active:scale-95 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        TOPIC_STYLE[topic],
      ].join(" ")}
    >
      <img
        src={iconPath}
        alt=""
        aria-hidden="true"
        className="w-16 h-16 object-contain"
      />
      <span className={`text-sm font-semibold ${LABEL_STYLE[topic]}`}>
        {label}
      </span>
      <span className={`text-xs tabular-nums ${COUNT_STYLE[topic]}`}>
        {masteredCount}/{totalCount}
      </span>
    </button>
  );
}
