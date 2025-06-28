import { useState, useCallback } from 'react';

const Uploader = ({ type, onContentExtracted }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setProcessing(true);
    setError('');

    try {
      let extractedText = '';
      let title = file.name.replace(/\.[^/.]+$/, "");

      if (type === 'pdf' && file.type === 'application/pdf') {
        // PDF processing placeholder - in real implementation, use pdfjs-dist
        extractedText = 'Sample text extracted from PDF. This would contain the actual PDF content when integrated with pdfjs-dist library.';
      } else if (type === 'image' && file.type.startsWith('image/')) {
        // Image OCR placeholder - in real implementation, use tesseract.js
        extractedText = 'Sample text extracted from image. This would contain the actual OCR results when integrated with tesseract.js library.';
      } else {
        throw new Error(`Invalid file type for ${type} upload`);
      }

      if (extractedText.trim()) {
        onContentExtracted(extractedText, title);
      } else {
        setError('No text could be extracted from the file.');
      }
    } catch (error) {
      setError(`Failed to process ${type} file: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  }, [type, onContentExtracted]);

  const acceptedTypes = type === 'pdf' ? '.pdf' : '.jpg,.jpeg,.png,.gif,.bmp,.webp';

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
        <input
          type="file"
          accept={acceptedTypes}
          onChange={handleFileUpload}
          disabled={processing}
          className="hidden"
          id={`file-upload-${type}`}
        />
        <label htmlFor={`file-upload-${type}`} className="cursor-pointer">
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              {type === 'pdf' ? 'PDF files only' : 'JPG, PNG, GIF, BMP, WebP up to 10MB'}
            </p>
          </div>
        </label>
      </div>

      {processing && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">
            {type === 'pdf' ? 'Extracting text from PDF...' : 'Performing OCR on image...'}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Uploader;