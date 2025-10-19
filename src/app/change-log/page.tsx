import content from './content';

type ChangeLogEntry = {
  date: string;
  logs: string[];
};

export default function ChangeLogPage() {
  return (
    <div className="max-w-5xl mx-auto -mb-12 p-3 sm:p-6 pb-12 sm:pb-24">
      <h1 className="text-xl font-bold mb-3">Change Log</h1>
      <div>
        {content.map((entry: ChangeLogEntry) => (
          <div key={entry.date} className="mb-6">
            <h2 className="font-semibold mb-2">{entry.date}</h2>
            <ul className="list-disc list-inside">
              {entry.logs.map((log, index) => (
                <li key={index} className="text-gray-600">{log}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
