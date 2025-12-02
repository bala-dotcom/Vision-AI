import React, { useState, useEffect } from 'react';
import { generateVideo, checkGenerationStatus } from '../services/vertexai';
import { Play, Loader2, Sparkles, Video, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoGenerator = () => {
    const [accessToken, setAccessToken] = useState('');
    const [projectId, setProjectId] = useState('');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');

    // Load credentials from local storage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('vertex_access_token');
        const storedProjectId = localStorage.getItem('vertex_project_id');
        if (storedToken) setAccessToken(storedToken);
        if (storedProjectId) setProjectId(storedProjectId);
    }, []);

    // Save credentials to local storage when changed
    useEffect(() => {
        if (accessToken) localStorage.setItem('vertex_access_token', accessToken);
        if (projectId) localStorage.setItem('vertex_project_id', projectId);
    }, [accessToken, projectId]);

    const handleGenerate = async () => {
        if (!accessToken) {
            setError('Please enter your Google Cloud Access Token');
            return;
        }
        if (!projectId) {
            setError('Please enter your Google Cloud Project ID');
            return;
        }
        if (!prompt) {
            setError('Please enter a prompt');
            return;
        }

        setLoading(true);
        setError(null);
        setVideoUrl(null);
        setStatus('Initializing generation...');

        try {
            const data = await generateVideo(accessToken, projectId, prompt);

            if (data.id) {
                pollStatus(data.id);
            } else if (data.url) {
                setVideoUrl(data.url);
                setLoading(false);
                setStatus('Complete!');
            } else {
                throw new Error('Unexpected API response');
            }

        } catch (err) {
            setError(err.message);
            setLoading(false);
            setStatus('');
        }
    };

    const pollStatus = async (operationName) => {
        setStatus('Generating video with Veo 3.1 (this may take a moment)...');
        const interval = setInterval(async () => {
            try {
                const statusData = await checkGenerationStatus(accessToken, operationName);
                if (statusData.status === 'completed') {
                    clearInterval(interval);
                    setVideoUrl(statusData.url);
                    setLoading(false);
                    setStatus('Generation complete!');
                } else if (statusData.status === 'failed') {
                    clearInterval(interval);
                    throw new Error('Generation failed');
                }
                // Continue polling if 'processing'
            } catch (err) {
                clearInterval(interval);
                setError(err.message);
                setLoading(false);
                setStatus('');
            }
        }, 5000); // Poll every 5 seconds for Vertex AI
    };

    return (
        <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 border border-white/10 backdrop-blur-md shadow-2xl">
                        <Video className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
                        Vision AI
                    </h1>
                    <p className="text-gray-400 text-lg">Generate cinematic videos with Google Veo 3.1</p>
                </div>

                <div className="glass-panel rounded-3xl p-8 shadow-2xl backdrop-blur-xl bg-black/40 border border-white/10">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Project ID</label>
                                <input
                                    type="text"
                                    value={projectId}
                                    onChange={(e) => setProjectId(e.target.value)}
                                    placeholder="my-project-id"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Access Token</label>
                                <input
                                    type="password"
                                    value={accessToken}
                                    onChange={(e) => setAccessToken(e.target.value)}
                                    placeholder="ya29..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Prompt</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your vision..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px] resize-none"
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="text-sm">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${loading
                                ? 'bg-white/5 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{status}</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Generate Video</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {videoUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 glass-panel rounded-3xl p-2 shadow-2xl"
                        >
                            <video
                                src={videoUrl}
                                controls
                                autoPlay
                                loop
                                className="w-full rounded-2xl"
                            />
                            <div className="p-4 flex justify-between items-center">
                                <p className="text-sm text-gray-400">Generated with Veo 3.1 Fast</p>
                                <a
                                    href={videoUrl}
                                    download="vision-ai-generated.mp4"
                                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                    Download Video
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default VideoGenerator;
