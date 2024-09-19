"use client";

import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import RecipeDisplay from '../components/RecipeDisplay';
import { FaRobot, FaQuestionCircle, FaCamera } from 'react-icons/fa';

export default function Home() {
  const [showUpload, setShowUpload] = useState(false);
  const [ingredients, setIngredients] = useState<string>('');
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIngredients(e.target.value);
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.trim() === '') return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Generieren des Rezepts');
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Fehler beim Abrufen des Rezepts:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 animated-gradient">
      <h1 className="text-6xl font-extrabold text-white mb-8 text-center font-serif">
        CookVision
      </h1>

      <div className="flex flex-col items-center space-y-4">
        <button
          className="p-4 bg-white rounded-full shadow-lg flex items-center"
          onClick={() => setShowUpload(!showUpload)}
        >
          <FaCamera className="text-2xl text-gray-800" />
        </button>
        {showUpload && <ImageUploader />}
      </div>

      <div className="mt-16 flex flex-col items-center bg-white bg-opacity-10 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-white mb-4">Gib deine vorhandenen Zutaten ein:</h2>
        <textarea
          value={ingredients}
          onChange={handleInputChange}
          placeholder="Gib die Zutaten hier ein..."
          maxLength={300}
          className="w-full p-4 rounded-lg border border-gray-300 bg-white bg-opacity-80 text-gray-700 resize-none"
        />
        <button
          onClick={handleGenerateRecipe}
          disabled={loading}
          className={`mt-4 p-3 rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 ${loading ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' : 'bg-gradient-to-r from-green-400 to-green-600 text-white'}`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              <span className="ml-2">Ihr Rezept wird generiert...</span>
            </div>
          ) : (
            'Rezept generieren'
          )}
        </button>

        {recipe && (
          <div className="mt-8 w-full">
            <RecipeDisplay recipe={recipe} />
          </div>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="flex flex-col items-center bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
          <FaQuestionCircle className="text-6xl text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Wie funktioniert die App?</h2>
          <p className="text-white text-center">
            Gib deine Zutaten in das Textfeld ein und klicke auf "Rezept generieren", um ein Rezept basierend auf den Zutaten zu erhalten.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
          <FaRobot className="text-6xl text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Was bietet die AI?</h2>
          <p className="text-white text-center">
            Die AI analysiert die Zutaten und erstellt darauf basierende Rezeptvorschläge für ein schnelles und einfaches Kochen.
          </p>
        </div>
      </div>
    </main>
  );
}