import React from 'react';
import { FaUtensils, FaListUl, FaInfoCircle, FaClock, FaUsers } from 'react-icons/fa';

const RecipeDisplay = ({ recipe }) => {
  const { title, sections } = parseRecipeContent(recipe);

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 border-b-2 border-gray-200 pb-4">{title}</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex items-center">
          <FaClock className="text-green-500 mr-2" />
          <span className="text-gray-600">30 min</span>
        </div>
        <div className="flex items-center">
          <FaUsers className="text-green-500 mr-2" />
          <span className="text-gray-600">4 Portionen</span>
        </div>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
            {getIconForSection(section.title)}
            {section.title}
          </h3>
          {section.type === 'list' ? (
            <ul className="list-none pl-0 space-y-2">
              {section.content.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-3 mt-2"></span>
                  {/* Text wird hier als JSX-Komponente verarbeitet */}
                  <span className="text-gray-600">{parseIngredientText(item)}</span>
                </li>
              ))}
            </ul>
          ) : section.type === 'numbered' ? (
            <ol className="list-none pl-0 space-y-4">
              {section.content.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-4">{idx + 1}</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-600">{section.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

// Funktion, um den Text zu parsen und JSX-Komponenten für fett gedruckte Mengen zu erstellen
const parseIngredientText = (text) => {
  // Wir suchen nach Mengenangaben im Format <strong> und teilen den Text auf
  const parts = text.split(/(<strong>.*?<\/strong>)/);
  return parts.map((part, index) => {
    // Wenn es ein <strong>-Teil ist, rendern wir es als JSX-Komponente
    if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
      const content = part.replace(/<\/?strong>/g, ''); // Entferne die Tags
      return <strong key={index}>{content}</strong>;   // Rende den Text als <strong>
    }
    // Andernfalls rendern wir den normalen Text
    return <span key={index}>{part}</span>;
  });
};

const getIconForSection = (title) => {
  switch (title.toLowerCase()) {
    case 'zutaten':
      return <FaListUl className="mr-3 text-green-500" />;
    case 'anleitung':
      return <FaUtensils className="mr-3 text-green-500" />;
    case 'tipps':
      return <FaInfoCircle className="mr-3 text-green-500" />;
    default:
      return null;
  }
};

const parseRecipeContent = (recipeString) => {
  const lines = recipeString.split('\n');
  const title = lines[0].replace(/\*/g, '').trim();
  let currentSection = null;
  const sections = [];

  lines.slice(1).forEach(line => {
    line = line.trim();
    if (line === '') return;

    if (line.startsWith('**') && line.endsWith('**')) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        title: line.replace(/\*\*/g, ''),
        content: [],
        type: 'list'
      };
    } else if (currentSection) {
      if (line.match(/^\d+\./)) {
        currentSection.type = 'numbered';
        currentSection.content.push(line.replace(/^\d+\.\s*/, ''));
      } else if (line.startsWith('*')) {
        const [amount, ...ingredientParts] = line.replace(/^\*\s*/, '').split(' ');
        const ingredient = ingredientParts.join(' ');
        currentSection.content.push(`<strong>${amount}</strong> ${ingredient}`);
      } else {
        currentSection.content.push(line);
      }
    }
  });

  if (currentSection) sections.push(currentSection);

  return { title, sections };
};

export default RecipeDisplay;
