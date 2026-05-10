import hubLetters from "../assets/icons/hub_letters.png";
import hubNumbers from "../assets/icons/hub_numbers.png";
import hubShapes from "../assets/icons/hub_shapes.png";
import hubColors from "../assets/icons/hub_colors.png";
import lettersData from "./letters.json";
import numbersData from "./numbers.json";
import shapesData from "./shapes.json";
import colorsData from "./colors.json";
import type { Skill } from "./types";

export const ACTIVE_CHILD_ID = "child_1";

export type TopicKey = "letters" | "numbers" | "shapes" | "colors";

export const HUB_CONFIG = [
  { topic: "letters" as TopicKey, label: "Letters", icon: hubLetters, data: lettersData as Skill[] },
  { topic: "numbers" as TopicKey, label: "Numbers", icon: hubNumbers, data: numbersData as Skill[] },
  { topic: "shapes"  as TopicKey, label: "Shapes",  icon: hubShapes,  data: shapesData  as Skill[] },
  { topic: "colors"  as TopicKey, label: "Colors",  icon: hubColors,  data: colorsData  as Skill[] },
];

export const VALID_TOPICS = new Set<string>(HUB_CONFIG.map((h) => h.topic));
