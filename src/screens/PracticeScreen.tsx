import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Skill } from '../data/types';
import { VALID_TOPICS } from '../data/hubs';
import type { TopicKey } from '../data/hubs';
import { useAudio } from '../hooks/useAudio';
import { usePracticeSession } from '../hooks/usePracticeSession';
import FlashCard from '../components/FlashCard';
import HenCharacter from '../components/HenCharacter';
import bgImage from '../assets/backgrounds/homestead_default.png';

function practiceCorrectPhrase(skill: Skill): string {
  return skill.display_value;
}

function practiceWrongPhrase(skill: Skill): string {
  return "That's " + skill.display_value;
}

type HenExpressionState = 'thinking' | 'celebrating';

export default function PracticeScreen() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();

  const topicParam = topic ?? '';
  const isValidTopic = VALID_TOPICS.has(topicParam);
  const topicKey = (isValidTopic ? topicParam : 'letters') as TopicKey;

  const { currentCard, recordAttempt, advance } = usePracticeSession(topicKey);
  const { playNarration, playEffect, stopAll } = useAudio();

  const [henExpression, setHenExpression] = useState<HenExpressionState>('thinking');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const hasHadFirstTap = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Navigate home immediately when topic is invalid
  useEffect(() => {
    if (!isValidTopic) navigate('/');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount-only guard

  // Play prompt audio and reset card state whenever a new card arrives
  useEffect(() => {
    if (!currentCard) return;
    hasHadFirstTap.current = false;
    setHenExpression('thinking');
    setIsAdvancing(false);
    playNarration(
      'practice_prompt_' + currentCard.target.id,
      'Tap ' + currentCard.target.label
    );
  }, [currentCard]); // eslint-disable-line react-hooks/exhaustive-deps -- playNarration is stable

  // Cancel audio and any pending advance on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      stopAll();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- stable refs/callbacks

  function handleOptionTap(skillId: string): void {
    if (isAdvancing || !currentCard) return;

    const isCorrect = skillId === currentCard.target.id;

    if (!hasHadFirstTap.current) {
      recordAttempt(currentCard.target.id, isCorrect);
      hasHadFirstTap.current = true;
    }

    if (isCorrect) {
      setHenExpression('celebrating');
      playEffect('correct_chime');
      playNarration(
        'practice_correct_' + currentCard.target.id,
        'Yes! ' + practiceCorrectPhrase(currentCard.target)
      );
      setIsAdvancing(true);
      timeoutRef.current = setTimeout(() => advance(), 1500);
    } else {
      const tapped = currentCard.options.find(o => o.id === skillId);
      if (tapped) {
        playNarration('practice_wrong_' + tapped.id, practiceWrongPhrase(tapped));
      }
    }
  }

  if (!isValidTopic) {
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

      {/* Flash card — centered, z-10 content layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {currentCard && (
          <FlashCard
            card={currentCard}
            onOptionTap={handleOptionTap}
            disabled={isAdvancing}
          />
        )}
      </div>

      {/* Hen — bottom right, z-10 */}
      <div className="absolute bottom-4 right-4 z-10">
        <HenCharacter expression={henExpression} size="lg" />
      </div>
    </div>
  );
}
