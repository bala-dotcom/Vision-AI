import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import * as vertexaiService from './services/vertexai';
import * as apiService from './services/api';
import { formatInr, formatInrAmount } from './utils/currency';

function App() {
  // API Keys
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [googleProjectId, setGoogleProjectId] = useState('');

  const [prompt, setPrompt] = useState('');
  const [startImage, setStartImage] = useState(null);
  const [endImage, setEndImage] = useState(null);

  // Settings State
  const [selectedModel, setSelectedModel] = useState('veo-3.1-fast-generate-001');
  const [resolution, setResolution] = useState('720p');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('4s');
  const [sound, setSound] = useState(false);
  const [language, setLanguage] = useState('en');

  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  // History Data
  const [history, setHistory] = useState([]);

  const [sessionCost, setSessionCost] = useState(0);

  // Load data on mount
  useEffect(() => {
    // Load user preferences from localStorage (these stay in localStorage)
    const storedGoogleToken = localStorage.getItem('google_access_token');
    if (storedGoogleToken) setGoogleAccessToken(storedGoogleToken);

    const storedGoogleProjectId = localStorage.getItem('google_project_id');
    if (storedGoogleProjectId) setGoogleProjectId(storedGoogleProjectId);

    const storedModel = localStorage.getItem('selected_model');
    if (storedModel) {
      if (storedModel === 'veo-3.1-fast-generate-001') {
        setSelectedModel('veo-3.1-generate-preview');
        localStorage.setItem('selected_model', 'veo-3.1-generate-preview');
      } else {
        setSelectedModel(storedModel);
      }
    } else {
      setSelectedModel('veo-3.1-generate-preview');
    }

    const storedLanguage = localStorage.getItem('selected_language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }

    // Load history and session cost from database
    const loadFromDatabase = async () => {
      try {
        const [videos, cost] = await Promise.all([
          apiService.getVideos('all'),
          apiService.getSessionCost()
        ]);
        
        if (videos && videos.length > 0) {
          setHistory(videos);
          
          // Load last video
          const lastVideo = videos.find(v => v.status === 'completed' && v.url) || videos[0];
          if (lastVideo && lastVideo.url) {
            setVideoUrl(lastVideo.url);
            if (lastVideo.prompt) {
              setPrompt(lastVideo.prompt);
            }
          }
        }
        
        setSessionCost(cost);
      } catch (error) {
        console.error('Failed to load from database, falling back to localStorage:', error);
        
        // Fallback to localStorage if database fails
        const storedHistory = localStorage.getItem('video_history');
        if (storedHistory) {
          try {
            const parsedHistory = JSON.parse(storedHistory);
            if (parsedHistory.length > 0) {
              setHistory(parsedHistory);
            }
          } catch (e) {
            console.error('Failed to parse stored history:', e);
          }
        }
        
        const storedCost = localStorage.getItem('session_cost');
        if (storedCost) {
          setSessionCost(parseFloat(storedCost));
        }
      }
    };

    loadFromDatabase();
  }, []);

  // Save credentials to local storage when changed
  useEffect(() => {
    if (googleAccessToken) localStorage.setItem('google_access_token', googleAccessToken);
  }, [googleAccessToken]);

  useEffect(() => {
    if (googleProjectId) localStorage.setItem('google_project_id', googleProjectId);
  }, [googleProjectId]);

  useEffect(() => {
    localStorage.setItem('selected_model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('selected_language', language);
  }, [language]);

  // Note: Session cost and history are now managed by database
  // localStorage is only used for user preferences (model, language, credentials)

  const handleGenerate = async () => {
    console.log('handleGenerate called');

    // Only require project ID - backend will handle authentication
    if (!googleProjectId) {
      alert('Please enter your Google Cloud Project ID in settings');
      return;
    }

    if (!prompt) {
      alert('Please enter a prompt');
      return;
    }

    // Calculate estimated cost for this video
    const estimatedVideoCost = parseFloat(vertexaiService.estimateCost(selectedModel, duration, resolution, aspectRatio, sound));
    console.log(`💰 Estimated cost for this video: ${formatInr(estimatedVideoCost)}`);

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStatus(`Initializing... Estimated cost: ${formatInr(estimatedVideoCost)}`);

    console.log(`Starting video generation with Vertex AI (Veo) - Model: ${selectedModel}...`);

    try {
      const data = await vertexaiService.generateVideo(
        googleAccessToken,
        googleProjectId,
        prompt,
        startImage,
        endImage,
        {
          resolution,
          aspectRatio,
          duration,
          sound,
          language
        },
        selectedModel
      );

      console.log('Generation response:', data);

      if (data.name) {
        // Veo operation started - begin polling for completion
        setStatus(`Video generation started! Estimated cost: ${formatInr(estimatedVideoCost)}`);
        setLoading(false);

        const operationName = data.name;

        // Create video record in database
        let videoRecord = null;
        try {
          videoRecord = await apiService.createVideo({
            prompt,
            duration,
            resolution,
            aspectRatio,
            sound,
            language,
            model: selectedModel,
            status: 'processing'
          });
          
          // Add to local state
          setHistory(prev => [videoRecord, ...prev]);
        } catch (error) {
          console.error('Failed to create video in database:', error);
          // Fallback: use timestamp as ID
          const historyId = Date.now();
          setHistory(prev => [{
            id: historyId,
            url: null,
            thumbnail: null,
            prompt: prompt,
            duration: duration,
            resolution: resolution,
            ratio: aspectRatio,
            sound: sound,
            language: language,
            model: selectedModel,
            date: 'Processing...',
            status: 'processing'
          }, ...prev]);
          videoRecord = { id: historyId };
        }
        
        const historyId = videoRecord.id;

        // Start polling - try to fetch video directly (Veo doesn't support status API)
        let pollCount = 0;
        const maxPolls = 60; // 10 minutes (60 * 10 seconds)
        let consecutiveErrors = 0;

        const pollInterval = setInterval(async () => {
          pollCount++;

          if (pollCount > maxPolls) {
            clearInterval(pollInterval);
            setStatus('Video generation timed out. Please check Google Cloud Console.');
            setError('Timeout: Video took too long to generate');
            // Update history to show timeout
            try {
              await apiService.updateVideo(historyId, {
                status: 'error'
              });
            } catch (error) {
              console.error('Failed to update video status:', error);
            }
            
            setHistory(prev => prev.map(item =>
              item.id === historyId
                ? { ...item, date: 'Timed out', status: 'error' }
                : item
            ));
            return;
          }

          try {
            console.log(`🔄 Fetch attempt ${pollCount}/${maxPolls}...`);
            setStatus(`Checking video status... (${pollCount}/${maxPolls})`);

            // Try to fetch the video directly
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
            const fetchRes = await fetch(`${backendUrl}/api/fetch-video`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName })
            });

            const videoData = await fetchRes.json();
            console.log('📦 Fetch response:', videoData);

            if (videoData.status === 'completed' && videoData.url) {
              clearInterval(pollInterval);
              consecutiveErrors = 0;

              console.log('🎉 Video ready!', videoData.url);

              // Calculate actual cost for this video using all parameters
              const actualCost = parseFloat(vertexaiService.estimateCost(selectedModel, duration, resolution, aspectRatio, sound));
              
              // Update video in database
              try {
                await apiService.updateVideo(historyId, {
                  video_url: videoData.url,
                  thumbnail_url: videoData.url,
                  status: 'completed',
                  cost_usd: actualCost
                });
                
                // Refresh session cost from database
                const newSessionCost = await apiService.getSessionCost();
                setSessionCost(newSessionCost);
              } catch (error) {
                console.error('Failed to update video in database:', error);
                // Fallback: update local state
                setSessionCost(prev => prev + actualCost);
              }

              // Update main video display
              setVideoUrl(videoData.url);
              setStatus(`Complete! Cost: ${formatInr(actualCost)}`);

              // Update local history state
              setHistory(prev => prev.map(item =>
                item.id === historyId
                  ? { 
                      ...item, 
                      url: videoData.url, 
                      thumbnail: videoData.url, 
                      date: 'Just now', 
                      status: 'completed',
                      cost: actualCost,
                      model: selectedModel,
                      sound: sound,
                      language: language
                    }
                  : item
              ));
              
              // Reload history from database to ensure sync
              try {
                const updatedVideos = await apiService.getVideos('all');
                setHistory(updatedVideos);
              } catch (error) {
                console.error('Failed to reload history:', error);
              }

            } else if (videoData.status === 'processing') {
              // Still processing - this is expected
              consecutiveErrors = 0;
              console.log('⏳ Video still processing:', videoData.message || 'Please wait...');
              setStatus(`Generating video... (${pollCount}/${maxPolls}) Estimated cost: ${formatInr(estimatedVideoCost)}`);
            } else if (videoData.status === 'error') {
              // Permanent error - stop polling
              clearInterval(pollInterval);
              console.error('❌ Video generation error:', videoData.error);
              setStatus('Generation failed');
              setError(videoData.error || 'Unknown error occurred');
              // Update history to show error
              try {
                await apiService.updateVideo(historyId, {
                  status: 'error'
                });
              } catch (error) {
                console.error('Failed to update video status:', error);
              }
              
              setHistory(prev => prev.map(item =>
                item.id === historyId
                  ? { ...item, date: 'Failed', status: 'error' }
                  : item
              ));
              alert(`Error: ${videoData.error || 'Video generation failed'}`);
            } else {
              // Unknown response - keep polling but log it
              console.log('⚠️ Unknown response status:', videoData);
              setStatus(`Processing... (${pollCount}/${maxPolls})`);
            }
          } catch (err) {
            consecutiveErrors++;
            console.error('❌ Polling error:', err);
            
            // If we get too many consecutive errors, stop polling
            if (consecutiveErrors >= 5) {
              clearInterval(pollInterval);
              setStatus('Connection error');
              setError(`Failed to check video status: ${err.message}`);
              try {
                await apiService.updateVideo(historyId, {
                  status: 'error'
                });
              } catch (error) {
                console.error('Failed to update video status:', error);
              }
              
              setHistory(prev => prev.map(item =>
                item.id === historyId
                  ? { ...item, date: 'Error', status: 'error' }
                  : item
              ));
              alert('Lost connection to server. Please check if backend is running.');
            } else {
              setStatus(`Retrying... (error ${consecutiveErrors}/5)`);
            }
          }
        }, 10000); // Poll every 10 seconds


      } else if (data.url) {
        // Calculate actual cost for this video using all parameters
        const actualCost = parseFloat(vertexaiService.estimateCost(selectedModel, duration, resolution, aspectRatio, sound));
        
        setVideoUrl(data.url);
        
        // Create video record in database
        try {
          const videoRecord = await apiService.createVideo({
            prompt,
            duration,
            resolution,
            aspectRatio,
            sound,
            language,
            model: selectedModel,
            status: 'completed'
          });
          
          // Update with video URL and cost
          await apiService.updateVideo(videoRecord.id, {
            video_url: data.url,
            thumbnail_url: data.url,
            cost_usd: actualCost
          });
          
          // Refresh session cost
          const newSessionCost = await apiService.getSessionCost();
          setSessionCost(newSessionCost);
          
          // Reload history
          const updatedVideos = await apiService.getVideos('all');
          setHistory(updatedVideos);
        } catch (error) {
          console.error('Failed to save video to database:', error);
          // Fallback: update local state
          setHistory(prev => [{
            id: Date.now(),
            url: data.url,
            thumbnail: data.url,
            prompt: prompt,
            duration: duration,
            resolution: resolution,
            ratio: aspectRatio,
            sound: sound,
            language: language,
            model: selectedModel,
            date: 'Just now',
            cost: actualCost
          }, ...prev]);
          
          setSessionCost(prev => prev + actualCost);
        }

        setLoading(false);
        setStatus(`Complete! Cost: ${formatInr(actualCost)}`);
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected API response - check console for details');
      }

    } catch (err) {
      console.error('==========================================');
      console.error('GENERATION ERROR:');
      console.error(err);
      console.error('Error message:', err.message);
      console.error('==========================================');

      // Show error to user - properly extract error message
      let errorMessage = 'Generation failed. Check console for details.';
      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.error) {
        errorMessage = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
      } else {
        errorMessage = JSON.stringify(err);
      }
      
      console.error('Error details:', err);
      alert(`Error: ${errorMessage}`);

      setError(errorMessage);
      setLoading(false);
      setStatus('');
    }
  };

  const pollStatus = async (id) => {
    setStatus('Generating...');

    const interval = setInterval(async () => {
      try {
        const statusData = await vertexaiService.checkGenerationStatus(googleAccessToken, id);

        if (statusData.status === 'completed') {
          clearInterval(interval);
          setVideoUrl(statusData.url);

          // Calculate actual cost for this video using all parameters
          const actualCost = parseFloat(vertexaiService.estimateCost(selectedModel, duration, resolution, aspectRatio, sound));
          setSessionCost(prev => {
            const newTotal = prev + actualCost;
            localStorage.setItem('session_cost', newTotal.toString());
            return newTotal;
          });

          setLoading(false);
          setStatus(`Complete! Cost: ${formatInr(actualCost)}`);
        } else if (statusData.status === 'failed') {
          clearInterval(interval);
          throw new Error('Generation failed');
        }
      } catch (err) {
        clearInterval(interval);
        console.error(err);
        alert(err.message || 'Generation failed');
        setLoading(false);
        setStatus('');
      }
    }, 5000); // Poll every 5 seconds for Vertex AI
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <Sidebar
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        googleAccessToken={googleAccessToken}
        setGoogleAccessToken={setGoogleAccessToken}
        googleProjectId={googleProjectId}
        setGoogleProjectId={setGoogleProjectId}
        prompt={prompt}
        setPrompt={setPrompt}
        startImage={startImage}
        setStartImage={setStartImage}
        endImage={endImage}
        setEndImage={setEndImage}
        // Settings
        resolution={resolution}
        setResolution={setResolution}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        duration={duration}
        setDuration={setDuration}
        sound={sound}
        setSound={setSound}
        language={language}
        setLanguage={setLanguage}

        sessionCost={sessionCost}
        history={history}
        onSelectVideo={(url, itemPrompt) => {
          setVideoUrl(url);
          if (itemPrompt) {
            setPrompt(itemPrompt);
          }
        }}

        onGenerate={handleGenerate}
        loading={loading}
        status={status}
      />
      <MainContent
        videoUrl={videoUrl}
        history={history}
        onSelectVideo={(url, itemPrompt) => {
          setVideoUrl(url);
          if (itemPrompt) {
            setPrompt(itemPrompt);
          }
        }}
        onClearVideo={() => {
          setVideoUrl(null);
        }}
      />
    </div>
  );
}

export default App;
