import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MdProps = {
  children: string;
  className?: string;
};

// Why does this need to be so complicated? 🤮
// Because we want to support task lists with interactive checkboxes,
// while also rendering normal markdown content.
// The react-markdown library supports task lists, but the checkboxes
// it renders are not interactive (they don't maintain state).
// So we need to parse the markdown ourselves to separate out
// task list items from normal markdown, render them differently,
// and manage the checkbox state in React.
export default function Md({ children, className = '' }: MdProps) {
  // detect task lines: "- [ ]", "- []", "- [x]", "- [X]" and capture the label (may be empty)
  const taskLineRe = /^\s*-\s*\[\s*(x|X)?\s*\]\s*(.*)$/;

  // parse lines and build an array of nodes (either task descriptor or markdown chunk)
  const lines = children.split(/\r?\n/);

  type Node =
    | { type: 'task'; checked: boolean; label: string }
    | { type: 'md'; text: string };

  const nodes: Node[] = [];
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    nodes.push({ type: 'md', text: buffer.join('\n') });
    buffer = [];
  };

  for (const line of lines) {
    const m = line.match(taskLineRe);
    if (m) {
      // it's a task line
      flushBuffer();
      const checked = !!m[1]; // 'x' or 'X' => true, otherwise false
      const label = m[2] ?? '';
      nodes.push({ type: 'task', checked, label });
    } else {
      buffer.push(line);
    }
  }
  flushBuffer();

  // init checked state from parsed tasks
  const initial = nodes
    .filter((n) => n.type === 'task')
    .map((n) => (n as any).checked as boolean);
  const [checkedStates, setCheckedStates] = useState<boolean[]>(initial);

  // counter for tasks when rendering
  let taskIdx = 0;

  return (
    <div className={className}>
      {nodes.map((node, idx) => {
        if (node.type === 'task') {
          const i = taskIdx++;
          const checked = checkedStates[i] || false;
          return (
            <div
              key={`task-${idx}`}
              className="flex items-start gap-2 my-1"
              // remove list bullet by not rendering inside <ul>/<li>
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const s = [...checkedStates];
                  s[i] = !s[i];
                  setCheckedStates(s);
                }}
                className="mt-1 cursor-pointer"
              />
              <div
                // render markdown inside the label so inline formatting works
                style={{ flex: 1 }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {node.label || '' /* allow empty label */}
                </ReactMarkdown>
              </div>
            </div>
          );
        }

        // markdown chunk
        return (
          <div key={`md-${idx}`} className="prose my-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {node.text || ''}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}
