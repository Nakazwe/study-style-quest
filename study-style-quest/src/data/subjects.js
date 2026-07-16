export const SUBJECTS = [
  { id: 'maths',       label: 'Mathematics',     emoji: '📐', desc: 'Numbers, algebra, geometry',          type: 'core' },
  { id: 'english',     label: 'English',          emoji: '📖', desc: 'Language, writing, literature',       type: 'core' },
  { id: 'science',     label: 'Science',          emoji: '🔬', desc: 'Physics, chemistry, earth science',   type: 'core' },
  { id: 'biology',     label: 'Biology',          emoji: '🧬', desc: 'Cells, organisms, ecosystems',        type: 'core' },
  { id: 'geography',   label: 'Geography',        emoji: '🌍', desc: 'Maps, environments, resources',       type: 'optional' },
  { id: 'history',     label: 'History',          emoji: '🏛',  desc: 'Events, people, civilisations',      type: 'optional' },
  { id: 'civics',      label: 'Civic Education',  emoji: '⚖️',  desc: 'Government, rights, democracy',      type: 'optional' },
  { id: 'computer',    label: 'Computer Studies', emoji: '💻', desc: 'Technology, programming, systems',    type: 'optional' },
  { id: 'physics',     label: 'Physics',          emoji: '⚡', desc: 'Forces, energy, motion',              type: 'optional' },
  { id: 'chemistry',   label: 'Chemistry',        emoji: '⚗️',  desc: 'Elements, reactions, compounds',     type: 'optional' },
  { id: 'agriculture', label: 'Agriculture',      emoji: '🌱', desc: 'Farming, soils, crop production',    type: 'optional' },
  { id: 'art',         label: 'Art & Design',     emoji: '🎨', desc: 'Creativity, colour, composition',    type: 'optional' },
]

export const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map(s => [s.id, s]))
export const CORE_IDS    = SUBJECTS.filter(s => s.type === 'core').map(s => s.id)