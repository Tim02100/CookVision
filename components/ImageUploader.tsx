'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ImageUploader() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'capture' | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Bildanalyse');
      }

      const data = await response.json();
      setIngredients(data.ingredients);
    } catch (error) {
      console.error('Fehler:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="flex space-x-4 mb-4">
        {/* Button zum Bildauswählen */}
        <label
          htmlFor="file-upload"
          className={`cursor-pointer bg-white text-green-700 font-bold py-2 px-4 rounded-full hover:bg-green-100 transition duration-300 ${uploadMode === 'capture' ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setUploadMode('upload')}
        >
          Bild auswählen
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={uploadMode === 'capture'}
        />

        {/* Button zum Foto aufnehmen */}
        <label
          htmlFor="camera-upload"
          className={`cursor-pointer bg-white text-green-700 font-bold py-2 px-4 rounded-full hover:bg-green-100 transition duration-300 ${uploadMode === 'upload' ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => setUploadMode('capture')}
        >
          Foto aufnehmen
        </label>
        <input
          id="camera-upload"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
          disabled={uploadMode === 'upload'}
        />
      </div>

      {preview && (
        <div className="mb-4">
          <Image src={preview} alt="Vorschau" width={300} height={300} className="rounded-lg" />
        </div>
      )}

      <button
        onClick={analyzeImage}
        disabled={!image || loading}
        className="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Analysiere...' : 'Zutaten erkennen'}
      </button>

      {ingredients.length > 0 && (
        <div className="mt-4 bg-white bg-opacity-80 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2 text-green-800">Erkannte Zutaten:</h2>
          <ul className="list-disc pl-5 text-green-700">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
