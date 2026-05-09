import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import TopicMenuScreen from "./screens/TopicMenuScreen";
import LearnScreen from "./screens/LearnScreen";
import PracticeScreen from "./screens/PracticeScreen";
import DailyScreen from "./screens/DailyScreen";
import ParentCornerScreen from "./screens/ParentCornerScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/topic/:topic" element={<TopicMenuScreen />} />
      <Route path="/learn/:topic" element={<LearnScreen />} />
      <Route path="/practice/:topic" element={<PracticeScreen />} />
      <Route path="/daily" element={<DailyScreen />} />
      <Route path="/parent" element={<ParentCornerScreen />} />
    </Routes>
  );
}
