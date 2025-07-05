// Utility to ensure each language JSON in Languages/ has {word, translation}
// For German, French, Arabic etc., translation -> English.
// For English dictionary, translation -> French.
// Uses LibreTranslate public API (https://libretranslate.com) – no key required but rate-limited.
// Run: `node scripts/translate_dicts.js` from project root.

import fs from 'fs/promises';
import path from 'path';

const LANG_DIR = path.join(process.cwd(), 'Languages');

// Map filename to source language code understood by LibreTranslate
const FILES = {
  'German.json': 'de',
  'French.json': 'fr',
  'Arabic.json': 'ar',
  'English.json': 'en',
};

// --- Translation helpers ---
const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function translate(text, source, target) {
  if (!text) return '';
  if (source === target) return text;
  if (OPENAI_KEY) {
    // Use OpenAI Chat API for better quota if key provided
    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: `Translate the following word from ${source} to ${target}. Return ONLY the translation text.` },
            { role: 'user', content: text }
          ],
          temperature: 0.2
        })
      });
      const data = await resp.json();
      return data.choices?.[0]?.message?.content?.trim() || '';
    } catch (e) {
      console.error('OpenAI translate failed', e.message);
      // fallback to libre
    }
  }
  const resp = await globalThis.fetch('https://libretranslate.de/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: text, source, target, format: 'text' })
  });
  if (!resp.ok) throw new Error('fetch failed');
  const data = await resp.json();
  return data.translatedText || '';
}

async function processFile(fileName, srcLang) {
  const filePath = path.join(LANG_DIR, fileName);
  const raw = JSON.parse(await fs.readFile(filePath, 'utf8'));
  let wordsArr = Array.isArray(raw) ? raw : raw.words;
  if (!Array.isArray(wordsArr)) {
    console.error(`Unrecognized structure in ${fileName}`);
    return;
  }

  // Normalise to objects
  wordsArr = wordsArr.map(w => (typeof w === 'string' ? { word: w, translation: '' } : w));

  const target = fileName === 'English.json' ? 'fr' : 'en';

  for (const item of wordsArr) {
    if (!item.translation) {
      try {
        item.translation = await translate(item.word, srcLang, target);
        console.log(`${item.word} -> ${item.translation}`);
        // polite delay to avoid hitting rate limits
        await new Promise(r => setTimeout(r, 400));
      } catch (err) {
        console.error('Translate error', item.word, err.message);
      }
    }
  }

  const outJson = { words: wordsArr };
  await fs.writeFile(filePath, JSON.stringify(outJson, null, 2), 'utf8');
  console.log(`Updated ${fileName}`);
}

(async () => {
  for (const [file, lang] of Object.entries(FILES)) {
    await processFile(file, lang);
  }
  console.log('All dictionaries processed');
})();
