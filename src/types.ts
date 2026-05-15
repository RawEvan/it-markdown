/** Parsed iMD widget (extension block or link-style control). */
export type ImdWidget =
  | {
      kind: "button";
      label: string;
      id?: string;
      /** Declared handler from source (may be unsafe; see render options). */
      onClickRaw?: string;
      /** Normalized action=value pairs when using safe attribute grammar. */
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

export type ImdSegment =
  | { type: "markdown"; value: string }
  | { type: "widget"; widget: ImdWidget };

/** Reserved for future parse-time flags (parsing always emits one `[!tab:]` widget per block). */
export type ParseImdOptions = Record<string, never>;

export type RenderHtmlOptions = {
  /**
   * When true (default), consecutive `tab` widgets render as one tab group.
   * When false, each `[!tab:]` block is a separate tab control (useful for multiple groups in one doc).
   */
  groupTabs?: boolean;
  /** When true (default), strip arbitrary JS from button handlers. */
  safeMode?: boolean;
  /** Optional root class on the wrapper. */
  className?: string;
  /** When true, wrap interactive controls for no-JS environments (static labels only). */
  staticOnly?: boolean;
};
