import React from 'react';
import type { Skill } from '../data/types';

interface SkillCardProps {
  skill: Skill;
  onTap: () => void;
  position: { current: number; total: number };
}

// SVG shape elements keyed by skill.id. ViewBox 200×200 for all shapes.
const SHAPE_ELEMENTS: Record<string, React.ReactElement> = {
  shape_circle: <circle cx="100" cy="100" r="80" />,
  shape_square: <rect x="20" y="20" width="160" height="160" rx="8" />,
  shape_triangle: <polygon points="100,20 180,180 20,180" />,
  shape_rectangle: <rect x="20" y="50" width="160" height="100" rx="8" />,
  // 5-point star: outer r=80, inner r=35, center 100,100
  shape_star: (
    <polygon points="100,20 121,72 176,75 133,111 147,165 100,135 53,165 67,111 24,75 79,72" />
  ),
  shape_heart: (
    <path d="M100,145 C60,120 20,95 20,65 C20,38 42,20 65,20 C80,20 92,28 100,38 C108,28 120,20 135,20 C158,20 180,38 180,65 C180,95 140,120 100,145 Z" />
  ),
};

function SkillFocalElement({ skill }: { skill: Skill }): React.ReactElement {
  switch (skill.topic) {
    case 'letters':
    case 'numbers':
      return (
        <span
          className="text-[10rem] font-bold leading-none text-amber-800 font-display select-none"
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
          width="250"
          height="250"
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
          className="w-64 h-64 rounded-3xl shadow-md border-2 border-amber-200"
          style={{ backgroundColor: skill.color_hex ?? '#CCCCCC' }}
          aria-hidden="true"
        />
      );
  }
}

const SkillCard = React.memo(function SkillCard({ skill, onTap, position }: SkillCardProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`${skill.label}, item ${position.current} of ${position.total}, tap to continue`}
      className={[
        'relative flex flex-col items-center justify-center gap-4',
        'w-full max-w-lg mx-auto px-8 py-10',
        'bg-amber-50 rounded-3xl shadow-lg',
        'active:scale-95 transition-transform duration-100',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400',
        'cursor-pointer',
      ].join(' ')}
    >
      <span
        className="absolute top-4 right-5 text-sm text-gray-400 font-light select-none"
        aria-hidden="true"
      >
        {position.current} of {position.total}
      </span>

      <div className="flex items-center justify-center mt-4">
        <SkillFocalElement skill={skill} />
      </div>

      <p className="text-2xl font-semibold text-amber-900 text-center font-display">
        {skill.label}
      </p>

      <p className="text-xl italic text-amber-700 text-center leading-snug max-w-xs">
        {skill.association}
      </p>
    </button>
  );
});

export default SkillCard;
