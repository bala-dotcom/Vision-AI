import React, { useRef, useState, useMemo } from 'react';
import { Settings, Image as ImageIcon, Video, Music, ChevronDown, Plus, Type, Monitor, Clock, Ratio, VolumeX, X, BarChart3, Globe } from 'lucide-react';
import { estimateCost } from '../services/vertexai';
import { formatInr, formatInrAmount } from '../utils/currency';
import UsageDetails from './UsageDetails';

const Sidebar = ({
    selectedModel,
    setSelectedModel,
    googleAccessToken,
    setGoogleAccessToken,
    googleProjectId,
    setGoogleProjectId,
    prompt,
    setPrompt,
    onGenerate,
    loading,
    status,
    startImage,
    setStartImage,
    endImage,
    setEndImage,
    resolution,
    setResolution,
    aspectRatio,
    setAspectRatio,
    duration,
    setDuration,
    sound,
    setSound,
    language,
    setLanguage,
    sessionCost = 0,
    history = [],
    onSelectVideo
}) => {
    const startInputRef = useRef(null);
    const endInputRef = useRef(null);
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [showUsageDetails, setShowUsageDetails] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    // Auto-close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showModelDropdown && !event.target.closest('.model-selector')) {
                setShowModelDropdown(false);
            }
            if (showLanguageDropdown && !event.target.closest('.language-selector')) {
                setShowLanguageDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showModelDropdown, showLanguageDropdown]);

    const models = [
        { id: 'veo-3.1-generate-preview', name: 'Veo 3.1 Preview', provider: 'Google Vertex AI' },
        { id: 'veo-3.1-generate-001', name: 'Veo 3.1 Standard', provider: 'Google Vertex AI' }
    ];

    const activeModel = models.find(m => m.id === selectedModel) || models[0];
    const hasKey = !!googleAccessToken && !!googleProjectId;
    
    // Calculate estimated cost reactively - updates when any parameter changes
    const estimatedCost = useMemo(() => {
        return estimateCost(selectedModel, duration, resolution, aspectRatio, sound);
    }, [selectedModel, duration, resolution, aspectRatio, sound]);

    const handleImageUpload = (e, isStart) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isStart) {
                    setStartImage(reader.result);
                } else {
                    setEndImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Veo specific settings
    const resolutionOptions = ['720p', '1080p', '4k'];
    const durationOptions = ['4s', '6s', '8s'];
    const aspectRatioOptions = ['16:9', '9:16', '1:1', '4:3', '21:9'];
    const languageOptions = [
        { code: 'ta', name: 'Tamil' },
        { code: 'tu', name: 'Telugu' },
        { code: 'kn', name: 'Kannada' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'bn', name: 'Bengali' },
        { code: 'mr', name: 'Marathi' },
        { code: 'hi', name: 'Hindi' },
        { code: 'en', name: 'English' }
    ];
    const currentLanguage = languageOptions.find(lang => lang.code === language) || languageOptions[7];
    
    // Debug: Log language changes
    React.useEffect(() => {
        console.log('Language changed to:', language, currentLanguage.name);
    }, [language, currentLanguage.name]);

    return (
        <div className="w-[360px] bg-[#0f0f0f] border-r border-white/10 flex flex-col h-screen text-gray-300 font-sans relative">

            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                {/* App Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 tracking-tighter">
                        Vision AI
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/5" title="Total Session Cost">
                            <span className="text-xs font-medium text-green-500">₹</span>
                            <span className="text-xs font-medium text-white">{formatInrAmount(sessionCost)}</span>
                        </div>
                        <button
                            onClick={() => setShowUsageDetails(true)}
                            className="p-1.5 rounded-lg transition-colors text-gray-500 hover:text-white hover:bg-white/10"
                            title="View Usage Details"
                        >
                            <BarChart3 className="w-[17px] h-[17px]" />
                        </button>
                        <button
                            onClick={() => setShowKeyModal(true)}
                            className={`p-1.5 rounded-lg transition-colors ${hasKey ? 'text-green-500 hover:bg-green-500/10' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                            title="Set Google Cloud Credentials"
                        >
                            <Settings className="w-[17px] h-[17px]" />
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Model Selector */}
                    <div className="space-y-2 relative model-selector">
                        <button
                            onClick={() => setShowModelDropdown(!showModelDropdown)}
                            className="w-full flex items-center justify-between bg-[#1f1f1f] p-3 rounded-xl border border-white/5 hover:bg-[#252525] transition-colors text-left"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400">{activeModel.provider}</span>
                                <span className="text-sm font-medium text-white">{activeModel.name}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showModelDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1f1f1f] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl">
                                {models.map(model => (
                                    <button
                                        key={model.id}
                                        onClick={() => {
                                            setSelectedModel(model.id);
                                            setShowModelDropdown(false);
                                        }}
                                        className={`w-full p-3 text-left hover:bg-white/5 transition-colors flex flex-col ${selectedModel === model.id ? 'bg-white/5' : ''}`}
                                    >
                                        <span className="text-xs text-gray-400">{model.provider}</span>
                                        <span className="text-sm font-medium text-white">{model.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* References */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">References</label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Start Image */}
                            <div className="relative group">
                                <input
                                    type="file"
                                    ref={startInputRef}
                                    onChange={(e) => handleImageUpload(e, true)}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => !startImage && startInputRef.current.click()}
                                    className={`w-full aspect-square rounded-xl border border-dashed ${startImage ? 'border-blue-500/50' : 'border-white/10 hover:border-white/20'} flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden relative`}
                                >
                                    {startImage ? (
                                        <>
                                            <img src={startImage} alt="Start" className="w-full h-full object-cover" />
                                            <div
                                                onClick={(e) => { e.stopPropagation(); setStartImage(null); }}
                                                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-red-500/80 transition-colors cursor-pointer"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] flex items-center justify-center group-hover:bg-[#2a2a2a] transition-colors">
                                                <Plus className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-xs text-gray-500">Start image</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* End Image */}
                            <div className="relative group">
                                <input
                                    type="file"
                                    ref={endInputRef}
                                    onChange={(e) => handleImageUpload(e, false)}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => !endImage && endInputRef.current.click()}
                                    className={`w-full aspect-square rounded-xl border border-dashed ${endImage ? 'border-blue-500/50' : 'border-white/10 hover:border-white/20'} flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden relative`}
                                >
                                    {endImage ? (
                                        <>
                                            <img src={endImage} alt="End" className="w-full h-full object-cover" />
                                            <div
                                                onClick={(e) => { e.stopPropagation(); setEndImage(null); }}
                                                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-red-500/80 transition-colors cursor-pointer"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 rounded-lg bg-[#1f1f1f] flex items-center justify-center group-hover:bg-[#2a2a2a] transition-colors">
                                                <Plus className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-xs text-gray-500">End image</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prompt</label>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your video..."
                            className="w-full h-32 bg-[#1f1f1f] border border-white/5 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-none transition-colors"
                        />
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-4 gap-2">
                        {/* Resolution */}
                        <div className="relative group">
                            <button className="w-full bg-[#1f1f1f] rounded-lg p-2 flex flex-col items-center justify-center gap-1 border border-white/5 hover:bg-[#2a2a2a] transition-colors group-focus-within:border-blue-500/50">
                                <Monitor className="w-4 h-4 text-gray-400" />
                                <span className="text-[10px] font-medium">{resolution}</span>
                            </button>
                            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#1f1f1f] border border-white/10 rounded-lg overflow-hidden hidden group-focus-within:block z-10 shadow-xl">
                                {resolutionOptions.map((res) => (
                                    <button
                                        key={res}
                                        onClick={(e) => {
                                            setResolution(res);
                                            e.currentTarget.blur();
                                        }}
                                        className="w-full p-2 text-[10px] text-gray-300 hover:bg-white/10 hover:text-white text-center transition-colors"
                                    >
                                        {res}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="relative group">
                            <button className="w-full bg-[#1f1f1f] rounded-lg p-2 flex flex-col items-center justify-center gap-1 border border-white/5 hover:bg-[#2a2a2a] transition-colors group-focus-within:border-blue-500/50">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-[10px] font-medium">{duration}</span>
                            </button>
                            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#1f1f1f] border border-white/10 rounded-lg overflow-hidden hidden group-focus-within:block z-10 shadow-xl">
                                {durationOptions.map((dur) => (
                                    <button
                                        key={dur}
                                        onClick={(e) => {
                                            setDuration(dur);
                                            e.currentTarget.blur();
                                        }}
                                        className="w-full p-2 text-[10px] text-gray-300 hover:bg-white/10 hover:text-white text-center transition-colors"
                                    >
                                        {dur}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aspect Ratio */}
                        <div className="relative group">
                            <button className="w-full bg-[#1f1f1f] rounded-lg p-2 flex flex-col items-center justify-center gap-1 border border-white/5 hover:bg-[#2a2a2a] transition-colors group-focus-within:border-blue-500/50">
                                <Ratio className="w-4 h-4 text-gray-400" />
                                <span className="text-[10px] font-medium">{aspectRatio}</span>
                            </button>
                            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#1f1f1f] border border-white/10 rounded-lg overflow-hidden hidden group-focus-within:block z-10 shadow-xl">
                                {aspectRatioOptions.map((ratio) => (
                                    <button
                                        key={ratio}
                                        onClick={(e) => {
                                            setAspectRatio(ratio);
                                            e.currentTarget.blur();
                                        }}
                                        className="w-full p-2 text-[10px] text-gray-300 hover:bg-white/10 hover:text-white text-center transition-colors"
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sound */}
                        <button
                            onClick={() => setSound(!sound)}
                            className={`w-full bg-[#1f1f1f] rounded-lg p-2 flex flex-col items-center justify-center gap-1 border ${sound ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/5'} hover:bg-[#2a2a2a] transition-colors`}
                        >
                            {sound ? (
                                <Music className="w-4 h-4 text-blue-400" />
                            ) : (
                                <VolumeX className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={`text-[10px] font-medium ${sound ? 'text-blue-400' : ''}`}>{sound ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>

                    {/* Language Selector */}
                    <div className="space-y-2 language-selector">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Language</label>
                        <div className="relative">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowLanguageDropdown(!showLanguageDropdown);
                                }}
                                className="w-full bg-[#1f1f1f] rounded-lg p-3 flex items-center justify-between border border-white/5 hover:bg-[#2a2a2a] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-white">{currentLanguage.name}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showLanguageDropdown && (
                                <div 
                                    className="absolute top-full left-0 right-0 mt-2 bg-[#1f1f1f] border border-white/10 rounded-lg overflow-hidden z-50 shadow-xl max-h-64 overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {languageOptions.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setLanguage(lang.code);
                                                setShowLanguageDropdown(false);
                                                console.log('Language selected:', lang.code, lang.name);
                                            }}
                                            className={`w-full p-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${language === lang.code ? 'bg-white/5' : ''}`}
                                        >
                                            <span className="text-sm text-white">{lang.name}</span>
                                            {language === lang.code && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Generate Button */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Estimated Cost</span>
                    <span className="text-xs font-medium text-white">~{formatInr(estimatedCost)}</span>
                </div>
                <button
                    onClick={onGenerate}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{status || 'Generating...'}</span>
                        </>
                    ) : (
                        <>
                            <span className="text-lg">✨</span>
                            <span>Generate</span>
                        </>
                    )}
                </button>
            </div>

            {/* API Key Modal */}
            {showKeyModal && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1f1f1f] border border-white/10 rounded-xl p-4 w-full max-w-xs shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-white">
                                Google Cloud Credentials
                            </h3>
                            <button onClick={() => setShowKeyModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-gray-400">
                            Configure once - credentials stored in backend .env file (recommended) or enter manually
                        </p>
                        <div className="space-y-2">
                            <div>
                                <label className="text-[10px] text-gray-500 block mb-1">Project ID</label>
                                <input
                                    type="text"
                                    value={googleProjectId}
                                    onChange={(e) => setGoogleProjectId(e.target.value)}
                                    placeholder="my-project-id"
                                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 block mb-1">Access Token (Optional)</label>
                                <input
                                    type="password"
                                    value={googleAccessToken}
                                    onChange={(e) => setGoogleAccessToken(e.target.value)}
                                    placeholder="Leave empty if using service account"
                                    className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setShowKeyModal(false)}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                        >
                            Save Credentials
                        </button>
                    </div>
                </div>
            )}

            {/* Usage Details Modal */}
            <UsageDetails
                history={history}
                sessionCost={sessionCost}
                isOpen={showUsageDetails}
                onClose={() => setShowUsageDetails(false)}
                onSelectVideo={onSelectVideo}
            />
        </div >
    );
};

export default Sidebar;
