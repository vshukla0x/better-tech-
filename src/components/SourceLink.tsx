import type { Source } from "../lib/types";
import { Icon } from "./Icon";
export function SourceLink({
  source,
  compact = false,
}: {
  source: Source;
  compact?: boolean;
}) {
  return (
    <div className={`source-link ${compact ? "compact" : ""}`}>
      <a href={source.url} target="_blank" rel="noreferrer">
        {compact ? "Official requirements & compatibility" : source.title}
        <Icon name="external" size={13} />
      </a>
      {!compact && (
        <span>
          {source.author} ·{" "}
          {source.checked
            ? `Checked ${source.checked}`
            : "Not verified · Needs checking"}
        </span>
      )}
    </div>
  );
}
