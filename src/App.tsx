import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import LearnScreen from "./screens/LearnScreen";
import PracticeScreen from "./screens/PracticeScreen";
import DailyScreen from "./screens/DailyScreen";
import ParentCornerScreen from "./screens/ParentCornerScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/learn" element={<LearnScreen />} />
      <Route path="/practice" element={<PracticeScreen />} />
      <Route path="/daily" element={<DailyScreen />} />
      <Route path="/parent" element={<ParentCornerScreen />} />
    </Routes>
  );
}
