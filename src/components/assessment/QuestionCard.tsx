import type { Question } from "./assessmentTypes";

interface QuestionCardProps {
  question: Question;
  /** Index of the currently selected choice, or null if nothing selected. */
  selectedIndex: number | null;
  /** Called when the user selects a choice. */
  onSelect: (choiceIndex: number) => void;
}

/**
 * Renders a single assessment question with radio-button choices.
 * Uses fieldset/legend for accessibility; keyboard-navigable.
 */
export default function QuestionCard({
  question,
  selectedIndex,
  onSelect,
}: QuestionCardProps) {
  return (
    <fieldset className="w-full">
      <legend className="text-lg font-semibold leading-snug text-biq-text-primary sm:text-xl">
        {question.text}
      </legend>

      <div className="mt-6 space-y-3" role="group">
        {question.choices.map((choice, idx) => {
          const isSelected = selectedIndex === idx;
          const inputId = `${question.id}_choice_${idx}`;

          return (
            <label
              key={idx}
              htmlFor={inputId}
              className={[
                "flex min-h-12 cursor-pointer items-start gap-4 rounded-lg border px-4 py-3 text-sm transition-colors",
                isSelected
                  ? "border-biq-primary bg-biq-surface-1 text-biq-text-primary"
                  : "border-biq-border text-biq-text-secondary hover:border-biq-text-muted hover:bg-biq-surface-1",
              ].join(" ")}
            >
              <input
                type="radio"
                id={inputId}
                name={question.id}
                value={idx}
                checked={isSelected}
                onChange={() => onSelect(idx)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-biq-primary focus-visible:ring-2 focus-visible:ring-biq-primary focus-visible:ring-offset-2"
              />
              <span className="leading-relaxed">{choice.text}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
