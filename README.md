# LinguaMind - Language Learning Platform

## Project Overview
LinguaMind is a language learning web application designed to help users learn new vocabulary in different languages. This project serves as my final project before graduating as a Technician in Multimedia Development.

## Live Demo
Check out the live version of LinguaMind: [https://linguamindtester.vercel.app](https://linguamindtester.vercel.app)

## Features
- **Multi-language Support**: Learn words in various languages including German, English, French, Arabic, and Italian and many more to come
- **CEFR Level Filtering**: Filter vocabulary by language proficiency levels (A1-C2)
- **Interactive Quiz Mode**: Test your knowledge with interactive quizzes
- **Responsive Design**: Works on both desktop and mobile devices

## Current Implementation
- **Frontend**: Built with vanilla JavaScript, HTML5, and CSS3
- **Styling**: Uses Bootstrap 5 for responsive design and Bootstrap Icons
- **Temporary Data Storage**: Currently using JSON files for storing vocabulary
- **Backend**: Node.js with Express.js server
- **AI Integration**: Basic setup for OpenAI integration (requires API key) but still not implemented yet

## Future Enhancements
- **AI-Powered Features**: Planning to implement AI for personalized learning experiences
- **User Accounts**: To track progress and save favorite words
- **Audio Pronunciation**: Add audio support for better pronunciation
- **Expanded Vocabulary**: More words and phrases in each language

## Recent Contributions (by a Junior Frontend Developer)

As part of my ongoing work on this project, I've recently implemented several key features and improvements to enhance the user experience and fix critical bugs.

### 1. Complete UI/UX Redesign for Learning Modules

I've overhauled the **Flashcard** and **Quiz** modals to align with a new, modern design system. The goal was to create a cleaner, more intuitive, and visually consistent learning environment.

- **New Design System**: Implemented a consistent design across both modals, featuring a soft, off-white background (`#F8F5F0`), better typography, and a clear visual hierarchy.
- **Interactive Progress Indicators**: Both modals now feature progress dots and a text counter (`X / Y`) to give users a clear sense of their position within a set.
- **Improved Button Styles**: Redesigned all buttons for better clarity and interaction, with distinct styles for primary actions (e.g., 'Flip', 'Next') and secondary ones.

### 2. Gamified Streak Effects

To make the quiz more engaging, I introduced a gamified streak feature that rewards users with visual feedback for consecutive correct answers.

- **Floating Emoji Bursts**: When a user hits a streak of 3, 6, or 9 correct answers, a burst of emojis (🔥, 🧠, 💡) floats up from the bottom of the screen.
- **Dynamic Animations**: The emojis are animated using CSS to fade in, float upwards, and fade out, creating a delightful and rewarding experience without disrupting the quiz flow.

### 3. Bug Fixes & Stability Improvements

- **Fixed Non-Functional Quiz Navigation**: Resolved a critical bug where the "Next" button in the quiz would not become active, preventing users from advancing to the next question.
- **Resolved Server Port Conflict**: Addressed an `EADDRINUSE` error by updating the server port from 3000 to 3001, ensuring the application can start reliably even when the default port is occupied.

### 4. Data Pipeline for Vocabulary

- **Automated Data Build**: Ensured that newly added vocabulary in the raw data files (e.g., `german_transformed.json`) is correctly processed and included in the main `languageData.json` file used by the application by running the `npm run build` script.

## Getting Started

To run the application locally, follow these steps:

1.  **Clone the repository**

2.  **Navigate to the project directory**

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Build the language data:**
    This command combines all language JSON files from the `/data` directory into a single `languageData.json` file in the `/public` directory.
    ```bash
    npm run build
    ```

5.  **Start the server:**
    ```bash
    npm start
    ```

---

## Deutsche Version (German Version)

### Projektübersicht
LinguaMind ist eine Webanwendung zum Sprachenlernen, die Benutzern helfen soll, neues Vokabular in verschiedenen Sprachen zu lernen. Dieses Projekt dient als mein Abschlussprojekt vor meinem Abschluss als Techniker in Multimedia-Entwicklung.

### Funktionen
- **Unterstützung für mehrere Sprachen**: Lernen Sie Wörter in verschiedenen Sprachen, darunter Deutsch, Englisch, Französisch, Arabisch und Italienisch.
- **Filterung nach GER-Niveau**: Filtern Sie den Wortschatz nach Sprachniveaus (A1-C2).
- **Interaktiver Quiz-Modus**: Testen Sie Ihr Wissen mit interaktiven Quizfragen.
- **Responsives Design**: Funktioniert sowohl auf Desktop- als auch auf mobilen Geräten.

6.  **Open the application:**
    Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

- `public/` - Contains all static assets served to the client.
  - `index.html` - The main HTML file.
  - `app.js` - Core client-side JavaScript logic.
  - `style.css` - Custom styles.
  - `languageData.json` - Combined language data (generated by build script).
- `src/`
  - `server.js` - The Express.js server.
- `data/` - Contains the individual language JSON files.
- `scripts/`
  - `build-data.js` - The script to combine language data.
- `package.json` - Defines project dependencies and scripts.
- `vercel.json` - Configuration for Vercel deployment.

## Technologies Used
- **Frontend**:
  - HTML5
  - CSS3
  - Vanilla JavaScript
  - Bootstrap 5
  - Bootstrap Icons

- **Backend**:
  - Node.js
  - Express.js
  - OpenAI API (optional)

## Note
This project is currently using JSON files for data storage as an interim solution. The foundation for AI integration has been laid out with the OpenAI API, but the main functionality currently relies on static JSON data files.

## Author
Zayd Dahhaoui - Multimedia Development Student
