/** Parsed interactive widget (extension block or link-style control). */
export type ItMarkdownWidget =
  | {
      kind: "button";
      label: string;
      id?: string;
      /** Declared handler from source (may be unsafe; see render options). */
      onClickRaw?: string;
      /** Normalized key=value pairs from the link destination. */
      attrs: Record<string, string>;
    }
  | {
      kind: "slider";
      label: string;
      id?: string;
      min: number;
      max: number;
      value: number;
      attrs: Record<string, string>;
    }
  | {
      kind: "radio";
      label: string;
      id?: string;
      options: string[];
      attrs: Record<string, string>;
    }
  | {
      kind: "checkbox";
      label: string;
      id?: string;
      options: string[];
      attrs: Record<string, string>;
    }
  | { kind: "tab"; title: string; body: string }
  | { kind: "collapse"; title: string; body: string };

export type ItMarkdownSegment =
  | { type: "markdown"; value: string }
  | { type: "widget"; widget: ItMarkdownWidget };

/** Reserved for future parse-time options (none yet). */
export type ParseItMarkdownOptions = Record<string, never>;

export type RenderHtmlOptions = {
  /**
   * When true (default), consecutive `tab` widgets render as one tab group.
   * When false, each `[!tab:]` block is a separate tab control.
   */
  groupTabs?: boolean;
  /** When true (default), strip arbitrary JS from button handlers. */
  safeMode?: boolean;
  /** Optional root class on the wrapper. */
  className?: string;
  /** When true, wrap interactive controls for no-JS environments (static labels only). */
  staticOnly?: boolean;
};
