import React from 'react';
import type { Skill } from '../data/types';
import type { PracticeCard } from '../hooks/usePracticeSession';

export type FlashCardProps = {
  card: PracticeCard;
  onOptionTap: (skillId: string) => void;
  disabled?: boolean;
};

// Inline SVG shapes — same geometry as SkillCard, viewBox 200×200
const SHAPE_ELEMENTS: Record<string, React.ReactElement> = {
  shape_circle: <circle cx="100" cy="100" r="80" />,
  shape_square: <rect x="20" y="20" width="160" height="160" rx="8" />,
  shape_triangle: <polygon points="100,20 180,180 20,180" />,
  shape_rectangle: <rect x="20" y="50" width="160" height="100" rx="8" />,
  shape_star: (
    <polygon points="100,20 121,72 176,75 133,111 147,165 100,135 53,165 67,111 24,75 79,72" />
  ),
  shape_heart: (
    <path d="M100,145 C60,120 20,95 20,65 C20,38 42,20 65,20 C80,20 92,28 100,38 C108,28 120,20 135,20 C158,20 180,38 180,65 C180,95 140,120 100,145 Z" />
  ),
};

function OptionContent({ skill }: { skill: Skill }): React.ReactElement {
  switch (skill.topic) {
    case 'letters':
    case 'numbers':
      return (
        <span
          className="text-6xl font-bold leading-none text-amber-800 font-display select-none"
          aria-hidden="true"
        >
          {skill.display_value}
        </span>
      );

    case 'shapes': {
      const shapeEl = SHAPE_ELEMENTS[skill.id] ?? SHAPE_ELEMENTS['shape_circle'];
      return (
        <svg
          viewBox="0 0 200 200"
          width="80"
          height="80"
          aria-hidden="true"
          className="overflow-visible"
        >
          <g fill="#F59E0B" stroke="#92400E" strokeWidth="4">
            {shapeEl}
          </g>
        </svg>
      );
    }

    case 'colors':
      return (
        <div
          className="w-20 h-20 rounded-2xl shadow-inner border-2 border-amber-200"
          style={{ backgroundColor: skill.color_hex ?? '#CCCCCC' }}
          aria-hidden="true"
        />
      );
  }
}

export default function FlashCard({ card, onOptionTap, disabled = false }: FlashCardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto px-4">
      {card.options.map(skill => (
        <button
          key={skill.id}
          type="button"
          onClick={() => onOptionTap(skill.id)}
          aria-label={skill.label}
          className={[
            'flex items-center justify-center',
            'h-36 rounded-3xl',
            'bg-amber-50 shadow-lg',
            'border-4 border-amber-200',
            'transition-all duration-100 active:scale-95',
            'focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400',
            disabled
              ? 'opacity-60 pointer-events-none'
              : 'cursor-pointer hover:border-amber-400',
          ].join(' ')}
        >
          <OptionContent skill={skill} />
        </button>
      ))}
    </div>
  );
}
