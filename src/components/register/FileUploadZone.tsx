import { useRef, useState } from "react";
import { useTranslation } from "next-i18next/pages";
import { Upload, CheckCircle, X } from "lucide-react";

interface FileUploadZoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function FileUploadZone({ file, onChange, error }: FileUploadZoneProps) {
  const { t } = useTranslation("register");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const validate = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) return t("common.errors.file_type");
    if (f.size > MAX_SIZE) return t("common.errors.file_size");
    return null;
  };

  const handleFile = (f: File) => {
    const err = validate(f);
    if (err) { setFileError(err); return; }
    setFileError(null);
    onChange(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${Math.round(bytes / 1024)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  if (file) {
    return (
      <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-accent text-xs font-medium hover:underline flex-shrink-0 flex items-center gap-1"
        >
          <X size={14} />
          {t("common.upload_remove")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-primary bg-primary-light/30"
            : "border-gray-300 hover:border-primary hover:bg-primary-light/20"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload size={28} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 font-medium">{t("common.upload_drag")}</p>
        <p className="text-xs text-primary underline mt-1">{t("common.upload_click")}</p>
        <p className="text-xs text-gray-400 mt-2">{t("common.upload_hint")}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {(fileError || error) && (
        <p className="text-accent text-xs mt-1">{fileError || error}</p>
      )}
    </div>
  );
}
