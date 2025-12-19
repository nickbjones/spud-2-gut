export default function LoadingMessage() {
  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 tracking-widest">
      <span>Loading</span>
      <span className="animate-[blink_1.4s_steps(3)_infinite]">.</span>
      <span className="animate-[blink_1.4s_steps(3)_infinite_0.2s]">.</span>
      <span className="animate-[blink_1.4s_steps(3)_infinite_0.4s]">.</span>
    </div>
  );
}
