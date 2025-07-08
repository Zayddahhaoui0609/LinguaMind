# LinguaMind - Update Log

## 05/07/2025 - Vocabulary Expansion & Windows Build Fix

- **German Vocabulary +50 words**: Added new B1-level nouns such as *die Abteilung*, *der Ausflug*, *die Beratung*, etc. to `data/german_transformed.json`.
- **Cross-platform Build Script**: Replaced Unix `cp` with the `copyfiles` package in `package.json`, making `npm run build` functional on Windows. Added `copyfiles` as a devDependency.
- **Tap Icon Position Tweak**: Confirmed the smaller hand icon now sits at the top-right of each word card for better visibility.
- **languageData.json Regeneration**: Executed `npm run build` to regenerate `public/languageData.json` and copy image assets.



## 04/07/2025 - User Guide & UI Polish

- **Interactive User Guide**: Implemented a session-based prompt and a 3-page modal that loads images/descriptions dynamically from `guide.JSON`, with Previous/Next navigation.
- **Asset Fixes**: Moved screenshots into `public/Screenshots` and adjusted image path logic to ensure correct loading in production.
- **Design Consistency**: Restyled the guide prompt and guide modal to match the modern Flashcard/Quiz theme (green header, rounded corners, cream background).
- **Header Alignment**: Centered the LinguaMind logo and controls on all screen sizes; added subtle bounce animation to the logo.
- **Tap Icons on Word Cards**: Added green/white hand icons that indicate interactivity, switching color when a card is expanded.
- **CSS Cleanup**: Fixed missing braces and restored footer animations; added responsive tweaks and accessibility improvements.


## 23/06/2025 - Major UI/UX Overhaul & Project Restructure

- **Complete UI/UX Redesign**: Overhauled the Flashcard and Quiz modals with a new, modern, and consistent design system for a better user experience.
- **Project Restructure & GitHub Push**: Reorganized the entire project structure, removing old files and implementing a cleaner `public/src/data` split. Pushed the complete overhaul to the main GitHub repository.
- **Updated Documentation**: Updated the main `README.md` to reflect all recent contributions and created this `UPDATE.md` log.
- **Language Data Update**: Removed the Russian language data due to errors and inconsistencies.
- **Responsive Word Cards**: Adjusted font scaling and word-break rules so extremely long words fit on mobile.
- **BETA Badge**: Added a small inline 'BETA' pill next to the version tag in the footer.
- **Metadata Cleanup**: Updated links and removed redundant author references.

## 22/06/2025 - Feature Enhancements & Bug Fixes

- **Gamified Streak Effects**: Introduced a new streak system in the quiz, rewarding users with floating emoji animations (🔥, 🧠, 💡) for consecutive correct answers to improve engagement.
- **Quiz Navigation Fix**: Resolved a critical bug that prevented the "Next" button from functioning correctly in the quiz.
- **Server Stability**: Fixed a server startup issue by resolving a port conflict.
- **Vocabulary Data Pipeline**: Ensured new words added to the data files are correctly built into the main application data.

