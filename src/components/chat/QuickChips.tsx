'use client';

interface QuickChipsProps {
  onSelect: (text: string) => void;
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  const chips = [
    "Highlight Water Bodies",
    "Detect Changes",
    "Analyze Vegetation",
    "Explain this scene"
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(chip)}
          className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
