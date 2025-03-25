# Audio Translation App

A web application that records audio, translates it to different languages, and plays back the translated audio. Built with React and Sarvam AI APIs.

## Features

- Record audio from your microphone
- Select target language (Hindi, Kannada, Tamil, Bengali)
- Automatic speech-to-text conversion
- Text translation
- Text-to-speech conversion
- Playback of translated audio
- Real-time status updates
- Error handling and loading states

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Sarvam AI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd audio-translation-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Sarvam AI API key:
```
VITE_SARVAM_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## API Integration

The app uses three Sarvam AI APIs:
- Saarika: Speech-to-Text conversion
- Mayura: Text translation
- Bulbul: Text-to-Speech conversion

## Technologies Used

- React
- Vite
- MediaRecorder API
- Sarvam AI APIs
- CSS3 with animations
- Modern JavaScript (ES6+)

## Browser Support

The app works best on modern browsers that support:
- MediaRecorder API
- Audio API
- ES6+ JavaScript features

## License

MIT License
