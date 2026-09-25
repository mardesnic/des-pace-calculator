import type { ReactNode } from 'react';

type Props = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  suffix?: string;
  inputMode: 'decimal' | 'numeric';
  calculated: boolean;
  onChange: (text: string) => void;
  children?: ReactNode;
};

export function Field({
  id,
  label,
  value,
  placeholder,
  suffix,
  inputMode,
  calculated,
  onChange,
  children,
}: Props) {
  return (
    <div className={calculated ? 'field field--calculated' : 'field'}>
      <label className='field__label' htmlFor={id}>
        {label}
        {calculated && <span className='field__tag'>calculated</span>}
      </label>
      <div className='field__row'>
        <input
          id={id}
          className='field__input'
          value={value}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete='off'
          enterKeyHint='done'
          // Typing into a filled field replaces it rather than appending.
          onFocus={(e) => e.target.select()}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span className='field__suffix'>{suffix}</span>}
      </div>
      {children}
    </div>
  );
}
