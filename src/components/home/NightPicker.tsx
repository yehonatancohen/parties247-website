import { ReactNode } from 'react';

export interface NightPanel {
  key: string;
  label: string;
  count: number;
  content: ReactNode;
}

/**
 * Segmented night switch with no JavaScript: a native radio group (arrow keys
 * work out of the box) drives which server-rendered panel is visible via :has().
 * Keeping it a server component also keeps the card markup out of the RSC payload.
 */
export default function NightPicker({ panels, defaultKey }: { panels: NightPanel[]; defaultKey: string }) {
  const id = (key: string) => `night-${key}`;
  const css = panels
    .map((p) => `[data-nights]:has(#${id(p.key)}:checked) [data-night-panel="${p.key}"]{display:block}`)
    .join('') +
    // Browsers without :has() just show the default night.
    `@supports not selector(:has(a)){[data-night-panel="${defaultKey}"]{display:block}}`;

  return (
    <div data-nights>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="flex justify-center px-4">
        <div
          role="radiogroup"
          aria-label="בחירת לילה"
          className="grid w-full max-w-[520px] rounded-full bg-tile p-[3px]"
          style={{ gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))` }}
        >
          {panels.map((panel) => (
            <label
              key={panel.key}
              className="relative flex min-h-[40px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-1.5 text-[14px] font-semibold text-ink-2 transition-[background-color,color,box-shadow] duration-300 ease-apple hover:text-ink has-[:checked]:bg-tile-raised has-[:checked]:text-ink has-[:checked]:shadow-[0_3px_8px_rgba(0,0,0,0.35)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-link sm:text-[15px]"
            >
              <input
                type="radio"
                name="night"
                id={id(panel.key)}
                value={panel.key}
                defaultChecked={panel.key === defaultKey}
                className="sr-only"
              />
              {panel.label}
              <span className="hidden text-[12px] font-medium tabular-nums opacity-70 sm:inline">{panel.count}</span>
            </label>
          ))}
        </div>
      </div>

      {panels.map((panel) => (
        <div key={panel.key} data-night-panel={panel.key} className="mt-8 hidden sm:mt-10">
          {panel.content}
        </div>
      ))}
    </div>
  );
}
