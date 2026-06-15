import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertCircle, CheckCircle2, Loader2, UploadCloud } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadZoneProps {
  onUpload: (file: File) => void;
  status: 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
  errorMessage?: string;
}

export const UploadZone = ({ onUpload, status, errorMessage }: UploadZoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.android.package-archive': ['.apk'],
    },
    maxFiles: 1,
    disabled: status === 'uploading' || status === 'analyzing',
  });

  const isBusy = status === 'uploading' || status === 'analyzing';

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group flex min-h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-white p-6 text-center shadow-sm transition',
        isDragActive ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50',
        isBusy && 'cursor-not-allowed opacity-70',
      )}
    >
      <input {...getInputProps()} />

      {status === 'idle' && (
        <>
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-emerald-700">
            <UploadCloud className="h-6 w-6" />
          </span>
          <p className="text-sm font-semibold text-slate-800">Upload or drag an APK file</p>
          <p className="mt-1 text-xs text-slate-500">APK files only, up to 100MB.</p>
        </>
      )}

      {status === 'uploading' && (
        <>
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-emerald-700" />
          <p className="text-sm font-semibold text-slate-800">Uploading APK</p>
          <p className="mt-1 text-xs text-slate-500">Preparing the scan request.</p>
        </>
      )}

      {status === 'analyzing' && (
        <>
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-amber-700" />
          <p className="text-sm font-semibold text-slate-800">Analysis in progress</p>
          <p className="mt-1 text-xs text-slate-500">Static checks and report generation are running.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="mb-4 h-8 w-8 text-emerald-700" />
          <p className="text-sm font-semibold text-slate-800">Upload complete</p>
          <p className="mt-1 text-xs text-slate-500">Your report is ready to review.</p>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="mb-4 h-8 w-8 text-rose-700" />
          <p className="text-sm font-semibold text-rose-700">Upload failed</p>
          <p className="mt-1 text-xs text-rose-600">{errorMessage || 'An error occurred while uploading.'}</p>
        </>
      )}
    </div>
  );
};
