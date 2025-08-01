// import { labelStyles } from './sharedFormStyles';
import { HexColorPicker } from "react-colorful";

type ColorPickerProps = {
  // label?: string;
  color: string;
  onChange: (color: string) => void;
  className?: string;
};

const colorStyles = `w-24 h-12`;

export default function ColorPicker({
  color,
  onChange,
  className,
}: ColorPickerProps) {
  return (
    <div>
      <HexColorPicker color={color} onChange={onChange} />
    </div>
  );
}
