import { useNavigate } from "react-router-dom";
import HenCharacter from "../components/HenCharacter";
import TopicHub from "../components/TopicHub";
import { useProgress } from "../hooks/useProgress";
import lettersData from "../data/letters.json";
import numbersData from "../data/numbers.json";
import shapesData from "../data/shapes.json";
import colorsData from "../data/colors.json";
import bgImage from "../assets/backgrounds/homestead_default.png";
import parentCornerIcon from "../assets/icons/parent_corner.png";
import hubLetters from "../assets/icons/hub_letters.png";
import hubNumbers from "../assets/icons/hub_numbers.png";
import hubShapes from "../assets/icons/hub_shapes.png";
import hubColors from "../assets/icons/hub_colors.png";

const ACTIVE_CHILD_ID = "child_1";

const HUB_CONFIG = [
  { topic: "letters" as const, label: "Letters", icon: hubLetters, route: "/learn/letters", data: lettersData },
  { topic: "numbers" as const, label: "Numbers", icon: hubNumbers, route: "/learn/numbers", data: numbersData },
  { topic: "shapes"  as const, label: "Shapes",  icon: hubShapes,  route: "/learn/shapes",  data: shapesData  },
  { topic: "colors"  as const, label: "Colors",  icon: hubColors,  route: "/learn/colors",  data: colorsData  },
] as const;

export default function HomeScreen() {
  const navigate = useNavigate();
  const { isMastered } = useProgress(ACTIVE_CHILD_ID);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full-screen background */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Parent corner — top right */}
      <button
        onClick={() => navigate("/parent")}
        aria-label="Parent corner"
        className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 shadow-md transition-all duration-150 active:scale-95 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
      >
        <img
          src={parentCornerIcon}
          alt=""
          aria-hidden="true"
          className="w-8 h-8 object-contain"
        />
      </button>

      {/* Topic hub grid — centered */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="grid grid-cols-2 gap-6 pointer-events-auto">
          {HUB_CONFIG.map(({ topic, label, icon, route, data }) => {
            const masteredCount = data.filter((item) => isMastered(item.id)).length;
            return (
              <TopicHub
                key={topic}
                topic={topic}
                label={label}
                iconPath={icon}
                onPress={() => navigate(route)}
                masteredCount={masteredCount}
                totalCount={data.length}
              />
            );
          })}
        </div>
      </div>

      {/* Hen character — bottom left */}
      <div className="absolute bottom-4 left-4 z-10">
        <HenCharacter expression="happy" size="lg" />
      </div>
    </div>
  );
}
