import { useState } from 'react';
import AudioRecorder from './AudioRecorder';
import LanguageSelector from './LanguageSelector';
import AudioPlayer from './AudioPlayer';
import { speechToText, translateText, textToSpeech } from '../services/apiService';
import './TranslatorContainer.css';

const TranslatorContainer = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // Default to Hindi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleLanguageChange = (language) => {
    console.log('Language changed to:', language);
    setSelectedLanguage(language);
    // Clear previous results when language changes
    setTranscript('');
    setTranslation('');
    setAudioUrl('');
    setError(null);
  };

  // Clean up previous object URL when creating a new one
  const cleanupPreviousUrl = () => {
    if (audioUrl) {
      try {
        URL.revokeObjectURL(audioUrl);
        console.log('Revoked previous audio URL');
      } catch (err) {
        console.warn('Error revoking URL:', err);
      }
    }
  };

  const handleRecordingComplete = async (audioBlob, language) => {
    try {
      setLoading(true);
      setError(null);
      cleanupPreviousUrl();
      
      // Step 1: Convert speech to text using Saarika API
      console.log('Starting speech-to-text conversion...');
      const text = await speechToText(audioBlob, 'en-IN');
      if (!text) {
        throw new Error('No text was transcribed from the audio');
      }
      console.log('Speech-to-text result:', text);
      setTranscript(text);
      
      // Step 2: Translate text using Mayura API
      console.log('Starting translation...');
      // Use the language code without region
      const translatedText = await translateText(text, 'en-IN', language);
      if (!translatedText) {
        throw new Error('Translation failed - no translated text received');
      }
      console.log('Translation result:', translatedText);
      setTranslation(translatedText);
      
      // Step 3: Convert translated text to speech using Bulbul API
      console.log('Starting text-to-speech conversion...');
      // Pass the language code to text-to-speech
      const ttsBlob = await textToSpeech(translatedText, language);
      if (!ttsBlob || ttsBlob.size === 0) {
        throw new Error('Text-to-speech conversion failed - no audio received');
      }
      console.log('Text-to-speech result received, size:', ttsBlob.size, 'Content-Type:', ttsBlob.type);
      
      // Create URL directly from the blob
      const url = URL.createObjectURL(ttsBlob);
      console.log('Created audio URL:', url);
      
      // Small delay to ensure the browser has time to process the blob
      setTimeout(() => {
        setAudioUrl(url);
      }, 100);
      
    } catch (err) {
      console.error('Detailed error:', err);
      
      // Format a user-friendly error message
      let userErrorMessage = 'An error occurred during the translation process. Please try again.';
      
      if (err.message.includes('API error:')) {
        // Extract the specific API error message
        userErrorMessage = err.message;
      } else if (err.message.includes('format')) {
        userErrorMessage = 'The translation service returned an unexpected format. Please try again or select a different language.';
      } else if (err.message) {
        userErrorMessage = `Error: ${err.message}`;
      }
      
      setError(userErrorMessage);
      setAudioUrl(''); // Clear any partial audio URL
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="translator-container">
      <h1>Audio Translation App</h1>
      <p className="description">Record audio, translate it, and play it back in your selected language</p>
      
      <LanguageSelector 
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
      <AudioRecorder 
        onRecordingComplete={handleRecordingComplete}
        selectedLanguage={selectedLanguage}
      />
      
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Processing your audio...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <AudioPlayer 
        audioUrl={audioUrl}
        transcript={transcript}
        translation={translation}
      />
    </div>
  );
};

export default TranslatorContainer;