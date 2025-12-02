import { Download, Share2, Maximize2, ChevronDown, Globe, Layout, Filter, Grid, Search, Loader2, X } from 'lucide-react';
import { formatInr } from '../utils/currency';

const MainContent = ({ videoUrl, history = [], onSelectVideo, onClearVideo }) => {
    return (
        <div className="flex-1 bg-[#0a0a0a] h-screen overflow-hidden flex flex-col relative">
            {/* Top Navigation */}
            <div className="px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-medium">
                        <span className="text-lg">History</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
                        <Layout className="w-4 h-4" />
                        <span>Templates</span>
                    </button>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                    <button className="hover:text-white"><Filter className="w-4 h-4" /></button>
                    <button className="hover:text-white"><Grid className="w-4 h-4" /></button>
                    <button className="hover:text-white"><Search className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-0 custom-scrollbar">
                {videoUrl ? (
                    <div className="w-full max-w-4xl mx-auto aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group mb-8">
                        <video
                            key={videoUrl} // Force re-render on URL change
                            src={videoUrl}
                            controls
                            autoPlay
                            loop
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={videoUrl} download className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-black/70 transition-colors">
                                <Download className="w-4 h-4" />
                            </a>
                            <button className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-black/70 transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                            {onClearVideo && (
                                <button
                                    className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-red-500/80 transition-colors"
                                    onClick={() => onClearVideo()}
                                    title="Clear current video"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* History Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        <span>This Week</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 max-w-[250px] mx-auto">
                        {history.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No videos generated yet</p>
                                <p className="text-xs mt-1">Your generated videos will appear here</p>
                            </div>
                        ) : (
                            history.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => {
                                    if (item.url && onSelectVideo) {
                                        // Pass both URL and prompt to load into the prompt field
                                        onSelectVideo(item.url, item.prompt);
                                    }
                                }}
                                className="group relative aspect-[9/16] bg-[#1f1f1f] rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                            >
                                {item.url ? (
                                    <video
                                        src={item.url}
                                        preload="metadata"
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        onMouseEnter={(e) => {
                                            e.target.play().catch(() => {});
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.pause();
                                            e.target.currentTime = 0;
                                        }}
                                    />
                                ) : item.thumbnail ? (
                                    <img src={item.thumbnail} alt={item.prompt} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : item.status === 'error' ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20 text-gray-400 p-4 text-center border border-red-500/30">
                                        <X className="w-8 h-8 mb-2 text-red-500" />
                                        <span className="text-xs font-medium text-red-400">Error</span>
                                        <span className="text-[10px] text-gray-500 mt-1">{item.date || 'Failed'}</span>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#2a2a2a] text-gray-400 p-4 text-center">
                                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-blue-500" />
                                        <span className="text-xs font-medium text-white">{item.status === 'processing' ? 'Processing...' : 'Loading...'}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <p className="text-white text-sm line-clamp-2 mb-2">{item.prompt}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400">{item.date}</span>
                                            {item.cost && (
                                                <span className="text-[10px] text-green-400 font-medium">{formatInr(item.cost)}</span>
                                            )}
                                        </div>
                                        <button className="p-1.5 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                                            <Download className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MainContent;
