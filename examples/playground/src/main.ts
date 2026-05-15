import { renderImdToHtml } from "it-markdown";

const sample = `# MD Notepad - Interactive Markdown Editor

## Sliders

[Brightness](!slider:min=0,max=100,value=0,id=brightness)
[speed](!slider:min=0,max=10,value=6.6,step=0.1,id=speed)

## Checkboxes

[Select options](!checkbox:options=I agree to the terms|Subscribe to newsletter|Enable notifications,id=opts)

## Radio Buttons

[Pick a color](!radio:options=Red|Blue|Green|Yellow,id=color)
[Pick a size](!radio:options=Small|Medium|Large|Extra Large,id=size)

## Collapsible Sections

[!collapse:Show Project Details]
This is the hidden content that appears when expanded.
It can contain multiple lines of text.

## Tabs

[!tab:Overview]
This is the **Overview** tab. iMD extends standard CommonMark with a small set of interactive widgets.

[!tab:Details]
More detailed information goes here.

[!tab:History]
Version history and changelog.

[!tab:Settings]
Configure your preferences here.

## Summary

Please interact with the widgets above and save the results.
`;

const ta = document.querySelector<HTMLTextAreaElement>("#src")!;
const preview = document.querySelector<HTMLDivElement>("#preview")!;

function render() {
  preview.innerHTML = renderImdToHtml(ta.value, { safeMode: true, staticOnly: false });
  attachInteractiveBehaviors();
}

/**
 * Attach client-side interactive behaviors to rendered widgets.
 */
function attachInteractiveBehaviors() {
  // Tab switching
  preview.querySelectorAll('.imd-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll<HTMLButtonElement>('.imd-tab');
    const panels = tabGroup.querySelectorAll<HTMLDivElement>('.imd-tab-panel');
    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
        panels.forEach(p => p.hidden = true);
        tab.setAttribute('aria-selected', 'true');
        if (panels[idx]) panels[idx].hidden = false;
      });
    });
  });

  // Button click handlers
  preview.querySelectorAll<HTMLButtonElement>('.imd-button[data-imd-onclick]').forEach(btn => {
    btn.addEventListener('click', () => {
      try { new Function(btn.dataset.imdOnclick!)(); } catch(e) { console.error(e); }
    });
  });

  // Slider value display
  preview.querySelectorAll<HTMLInputElement>('.imd-slider input[type=range]').forEach(input => {
    // Avoid adding duplicate displays on re-render
    const parent = input.parentElement!;
    if (!parent.querySelector('.imd-slider-value-display')) {
      const display = document.createElement('span');
      display.className = 'imd-slider-value-display';
      display.textContent = input.value;
      parent.appendChild(display);
      input.addEventListener('input', () => { display.textContent = input.value; });
    }
  });
}

ta.value = sample;
ta.addEventListener("input", render);
render();
