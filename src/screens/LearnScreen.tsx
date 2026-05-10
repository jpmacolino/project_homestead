import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Skill } from '../data/types';
import { ACTIVE_CHILD_ID, HUB_CONFIG, VALID_TOPICS } from '../data/hubs';
import { useAudio } from '../hooks/useAudio';
import { useProgress } from '../hooks/useProgress';
import SkillCard from '../components/SkillCard';
import HenCharacter from '../components/HenCharacter';
import bgImage from '../assets/backgrounds/homestead_default.png';

export default function LearnScreen() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const { playNarration, playEffect, stopAll } = useAudio();
  const { markTopicLearnComplete } = useProgress(ACTIVE_CHILD_ID);

  const isValidTopic = topic !== undefined && VALID_TOPICS.has(topic);
  const hub = HUB_CONFIG.find((h) => h.topic === topic);
  const skills: Skill[] = hub?.data ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const completionFiredRef = useRef(false);

  // Narrate the current skill whenever the index changes (including initial mount)
  useEffect(() => {
    if (!isValidTopic || skills.length === 0) return;
    const skill = skills[currentIndex];
    playNarration(skill.audio_key, `This is ${skill.label}. ${skill.association}.`);
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps -- skills/playNarration are stable across renders

  // When completion is reached: narrate celebration and schedule auto-return
  useEffect(() => {
    if (!complete) return;
    playNarration(
      `learn_complete_${topic ?? ''}`,
      `Great job! You learned all the ${topic}!`
    );
    const timer = setTimeout(() => {
      navigate(`/topic/${topic}`);
    }, 4000);
    return () => clearTimeout(timer);
  }, [complete]); // eslint-disable-line react-hooks/exhaustive-deps -- topic/navigate are stable

  // Cancel any in-progress narration when the component unmounts
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- stopAll is stable

  if (!isValidTopic || !hub) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-amber-50">
        <p className="text-2xl font-semibold text-gray-700">Topic not found</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-2xl bg-amber-400 px-8 py-4 text-xl font-bold text-amber-900 shadow-md transition-all duration-150 active:scale-95 hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-amber-50">
        <p className="text-2xl font-semibold text-gray-700">No skills available for this topic.</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-2xl bg-amber-400 px-8 py-4 text-xl font-bold text-amber-900 shadow-md transition-all duration-150 active:scale-95 hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  function handleAdvance(): void {
    playEffect('tap');
    // Guard against rapid double-tap on the last card
    if (completionFiredRef.current) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < skills.length) {
      setCurrentIndex(nextIndex);
    } else {
      completionFiredRef.current = true;
      markTopicLearnComplete(topic!);
      playEffect('correct_chime');
      setComplete(true);
    }
  }

  if (complete) {
    return (
      <div className="relative h-screen w-full overflow-hidden">
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
          <HenCharacter expression="celebrating" size="lg" />
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Great job!
          </h1>
          <p className="text-2xl font-semibold text-white drop-shadow-md">
            You learned all the {topic}!
          </p>
          <button
            onClick={() => navigate(`/topic/${topic}`)}
            className="rounded-2xl bg-amber-400 px-8 py-4 text-xl font-bold text-amber-900 shadow-md transition-all duration-150 active:scale-95 hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-600"
          >
            Keep Going!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Home button — top left, z-20 */}
      <button
        onClick={() => navigate('/')}
        aria-label="Go home"
        className="absolute top-4 left-4 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 shadow-md text-xl transition-all duration-150 active:scale-95 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
      >
        🏠
      </button>

      {/* Skill card — centered, z-10 content layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <SkillCard
          skill={skills[currentIndex]}
          position={{ current: currentIndex + 1, total: skills.length }}
          onTap={handleAdvance}
        />
      </div>

      {/* Hen — bottom right, z-10 */}
      <div className="absolute bottom-4 right-4 z-10">
        <HenCharacter expression="happy" size="lg" />
      </div>
    </div>
  );
}
