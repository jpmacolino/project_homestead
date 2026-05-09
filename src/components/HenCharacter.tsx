import henHappy from "../assets/characters/hen_happy.png";
import henThinking from "../assets/characters/hen_thinking.png";
import henCelebrating from "../assets/characters/hen_celebrating.png";

type HenExpression = "happy" | "thinking" | "celebrating";
type HenSize = "sm" | "md" | "lg";

interface HenCharacterProps {
  expression: HenExpression;
  size?: HenSize;
}

const EXPRESSION_SRC: Record<HenExpression, string> = {
  happy: henHappy,
  thinking: henThinking,
  celebrating: henCelebrating,
};

const SIZE_CLASS: Record<HenSize, string> = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export default function HenCharacter({ expression, size = "md" }: HenCharacterProps) {
  return (
    <img
      src={EXPRESSION_SRC[expression]}
      alt={`Hen looking ${expression}`}
      className={`${SIZE_CLASS[size]} object-contain drop-shadow-md`}
    />
  );
}
