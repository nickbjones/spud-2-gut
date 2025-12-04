export default function LoadingMessage() {
  return (
    <div className="m-8 tracking-widest flex items-center space-x-0.5">
      <span>Loading</span>
      <span className="animate-[blink_1.4s_steps(3)_infinite]">.</span>
      <span className="animate-[blink_1.4s_steps(3)_infinite_0.2s]">.</span>
      <span className="animate-[blink_1.4s_steps(3)_infinite_0.4s]">.</span>
    </div>
  );
}
