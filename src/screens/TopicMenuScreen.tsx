import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HenCharacter from "../components/HenCharacter";
import { useAudio } from "../hooks/useAudio";
import { useProgress } from "../hooks/useProgress";
import { ACTIVE_CHILD_ID, HUB_CONFIG, VALID_TOPICS } from "../data/hubs";
import bgImage from "../assets/backgrounds/homestead_default.png";

export default function TopicMenuScreen() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const { isTopicLearnComplete } = useProgress(ACTIVE_CHILD_ID);
  const { playNarration, playEffect } = useAudio();

  const hub = HUB_CONFIG.find((h) => h.topic === topic);
  const isValidTopic = topic !== undefined && VALID_TOPICS.has(topic);

  useEffect(() => {
    if (!hub || !topic) return;
    playNarration(
      `topic_menu_${topic}`,
      `What would you like to do with ${hub.label.toLowerCase()}?`
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount-only, topic is stable from URL params

  if (!isValidTopic || !hub) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-amber-50">
        <p className="text-2xl font-semibold text-gray-700">Topic not found</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-2xl bg-amber-400 px-8 py-4 text-xl font-bold text-amber-900 shadow-md transition-all duration-150 active:scale-95 hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  const practiceEnabled = isTopicLearnComplete(topic);

  function handleLearnTap(): void {
    playEffect("tap");
    navigate(`/learn/${topic}`);
  }

  function handlePracticeTap(): void {
    if (!practiceEnabled) return;
    playEffect("tap");
    navigate(`/practice/${topic}`);
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full-screen background */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Home button — top left */}
      <button
        onClick={() => navigate("/")}
        aria-label="Go home"
        className="absolute top-4 left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 shadow-md text-xl transition-all duration-150 active:scale-95 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
      >
        🏠
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-10 px-6">
        {/* Topic title */}
        <h1 className="text-5xl font-bold text-white drop-shadow-lg tracking-wide">
          {hub.label}
        </h1>

        {/* Mode tiles */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Learn tile — always enabled */}
          <button
            onClick={handleLearnTap}
            className="flex flex-col items-center gap-3 rounded-3xl bg-amber-400 px-12 py-10 shadow-xl transition-all duration-150 active:scale-95 hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-600"
          >
            <span className="text-6xl" aria-hidden="true">📖</span>
            <span className="text-4xl font-bold text-amber-900">Learn</span>
          </button>

          {/* Practice tile — locked until Learn is complete */}
          <button
            onClick={handlePracticeTap}
            tabIndex={practiceEnabled ? 0 : -1}
            aria-disabled={!practiceEnabled}
            className={[
              "flex flex-col items-center gap-3 rounded-3xl px-12 py-10 shadow-xl focus:outline-none",
              practiceEnabled
                ? "bg-emerald-400 hover:bg-emerald-300 transition-all duration-150 active:scale-95 focus:ring-4 focus:ring-emerald-600"
                : "bg-gray-300 opacity-50 cursor-not-allowed",
            ].join(" ")}
          >
            <span className="text-6xl" aria-hidden="true">⭐</span>
            <span
              className={`text-4xl font-bold ${practiceEnabled ? "text-emerald-900" : "text-gray-600"}`}
            >
              Practice
            </span>
            {!practiceEnabled && (
              <span className="text-sm text-gray-600">🔒 Finish Learn first</span>
            )}
          </button>
        </div>
      </div>

      {/* Hen character — bottom right */}
      <div className="absolute bottom-4 right-4 z-10">
        <HenCharacter expression="happy" size="lg" />
      </div>
    </div>
  );
}
