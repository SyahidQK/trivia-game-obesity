import { useRef } from 'react';
import { useStoredImage } from '../game/hooks';
import { fileToDataUrl } from './imageUpload';

interface Props {
  imageId: string | undefined;
  fallback: string;
  onPick: (dataUrl: string) => void;
  onClear?: () => void;
}

export function ImagePicker({ imageId, fallback, onPick, onClear }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const src = useStoredImage(imageId, fallback);

  return (
    <div className="image-picker">
      {src ? <img src={src} alt="" /> : <div className="image-empty">No image</div>}
      <div className="row">
        <button type="button" className="a-btn" onClick={() => input.current?.click()}>
          Upload image
        </button>
        {onClear && imageId && (
          <button type="button" className="a-btn a-btn-danger" onClick={onClear}>
            Remove
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onPick(await fileToDataUrl(file));
        }}
      />
    </div>
  );
}
