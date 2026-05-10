export interface Skill {
  id: string;
  topic: 'letters' | 'numbers' | 'shapes' | 'colors';
  track: string;
  display_value: string;
  label: string;
  association: string;
  audio_key: string;
  assess_weight: number;
  image_key: string;
  color_hex?: string; // only present for topic === 'colors'
}
