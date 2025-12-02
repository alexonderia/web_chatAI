import type { ModelInfo } from '../types';

interface Props {
  value: string;
  options?: ModelInfo[];
  onChange: (value: string) => void;
}

const ModelSelect = ({ value, options, onChange }: Props) => {
  return (
    <select className="select" value={value} onChange={(event) => onChange(event.target.value)}>
      {(options ?? [{ id: value, description: 'По умолчанию' }]).map((model) => (
        <option key={model.id} value={model.id}>
          {model.id} {model.description ? `· ${model.description}` : ''}
        </option>
      ))}
    </select>
  );
};

export default ModelSelect;