import React from 'react';

type MdProps = {
  children: string;
  className?: string;
};

export default function Md({ children, className = '' }: MdProps) {
  return (
    <div className={`prose ${className}`}>
      {children.split('\n').map((line, i) => {
        // Match "- [] some task" pattern
        const match = line.match(/^\s*-\s*\[\s*\]\s*(.*)/);
        if (match) {
          return (
            <div key={i} className="flex items-center gap-2">
              <input type="checkbox" />
              <span>{match[1]}</span>
            </div>
          );
        }

        // Render normal line
        if (line.trim() === '') return <br key={i} />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}
