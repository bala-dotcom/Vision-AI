import React, { useMemo, useState, useEffect } from 'react';
import { X, Video, TrendingUp, Volume2, VolumeX, Monitor, Film, DollarSign, BarChart3, Calendar, ChevronDown } from 'lucide-react';
import { formatInr, formatInrAmount } from '../utils/currency';
import * as apiService from '../services/api';

const UsageDetails = ({ history = [], sessionCost = 0, isOpen, onClose, onSelectVideo }) => {
    const [selectedDate, setSelectedDate] = useState('all');
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Fetch stats from API when date filter changes
    useEffect(() => {
        if (isOpen) {
            const fetchStats = async () => {
                setLoading(true);
                try {
                    const data = await apiService.getUsageStats(selectedDate);
                    setStats(data);
                } catch (error) {
                    console.error('Failed to fetch usage stats:', error);
                    // Fallback to calculating from history prop
                    setStats(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [isOpen, selectedDate]);
    // Extract available dates from history
    const availableDates = useMemo(() => {
        const completedVideos = history.filter(item => item.status === 'completed' || item.url);
        const dateSet = new Set();
        
        completedVideos.forEach(item => {
            let dateKey = null;
            let dateObj = null;
            
            if (item.id && typeof item.id === 'number') {
                dateObj = new Date(item.id);
                if (!isNaN(dateObj.getTime())) {
                    dateKey = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                }
            } else if (item.date) {
                if (item.date === 'Just now') {
                    dateObj = new Date();
                    dateKey = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                } else if (item.date !== 'Unknown' && item.date !== 'Processing...' && item.date !== 'Failed' && item.date !== 'Error') {
                    dateObj = new Date(item.date);
                    if (!isNaN(dateObj.getTime())) {
                        dateKey = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    }
                }
            }
            
            if (dateKey) {
                dateSet.add(dateKey);
            }
        });
        
        const dates = Array.from(dateSet).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateB - dateA;
        });
        
        return dates;
    }, [history]);

    // Helper function to get date key from video item
    const getDateKey = (item) => {
        let dateKey = null;
        let dateObj = null;
        
        if (item.id && typeof item.id === 'number') {
            dateObj = new Date(item.id);
            if (!isNaN(dateObj.getTime())) {
                dateKey = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            }
        } else if (item.date) {
            if (item.date === 'Just now') {
                dateObj = new Date();
                dateKey = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            } else if (item.date !== 'Unknown' && item.date !== 'Processing...' && item.date !== 'Failed' && item.date !== 'Error') {
                dateObj = new Date(item.date);
                if (!isNaN(dateObj.getTime())) {
                    dateKey = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                }
            }
        }
        
        return dateKey;
    };

    // Use API stats if available, otherwise calculate from history prop
    const calculatedStats = useMemo(() => {
        if (stats) {
            return stats; // Use API stats
        }
        
        // Fallback: calculate from history prop
        let completedVideos = history.filter(item => item.status === 'completed' || item.url);
        
        // Filter by selected date
        if (selectedDate !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            completedVideos = completedVideos.filter(item => {
                const itemDateKey = getDateKey(item);
                
                if (selectedDate === 'today') {
                    const itemDate = itemDateKey ? new Date(itemDateKey) : new Date();
                    itemDate.setHours(0, 0, 0, 0);
                    return itemDate.getTime() === today.getTime();
                } else if (selectedDate === 'yesterday') {
                    const itemDate = itemDateKey ? new Date(itemDateKey) : new Date();
                    itemDate.setHours(0, 0, 0, 0);
                    return itemDate.getTime() === yesterday.getTime();
                } else {
                    // Specific date selected
                    return itemDateKey === selectedDate;
                }
            });
        }
        
        const totalVideos = completedVideos.length;
        
        // Calculate total cost
        const totalCostFromHistory = completedVideos.reduce((sum, item) => sum + (item.cost || 0), 0);
        const totalCost = sessionCost > 0 ? sessionCost : totalCostFromHistory;
        const avgCost = totalVideos > 0 ? (totalCost / totalVideos) : 0;
        
        // Resolution breakdown
        const resolutionCounts = { '720p': 0, '1080p': 0, '4k': 0 };
        completedVideos.forEach(item => {
            const res = item.resolution || '720p';
            if (resolutionCounts[res] !== undefined) {
                resolutionCounts[res]++;
            }
        });
        
        // Sound breakdown
        const withSound = completedVideos.filter(item => item.sound === true || item.sound === 'ON').length;
        const withoutSound = totalVideos - withSound;
        
        return {
            totalVideos,
            totalCost,
            avgCost,
            resolutionCounts,
            withSound,
            withoutSound,
            completedVideos
        };
    }, [stats, history, sessionCost, selectedDate]);
    
    const displayStats = stats || calculatedStats;

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDateDropdown && !event.target.closest('.date-filter')) {
                setShowDateDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDateDropdown]);

    if (!isOpen) return null;

    const resolutionTotal = displayStats.resolutionCounts['720p'] + displayStats.resolutionCounts['1080p'] + displayStats.resolutionCounts['4k'];

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#1f1f1f] to-[#252525] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-blue-500/20 rounded-lg">
                            <BarChart3 className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Usage Analytics</h2>
                            <p className="text-[10px] text-gray-400 mt-0.5">Track your video generation statistics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Date Filter */}
                        <div className="relative date-filter">
                            <button
                                onClick={() => setShowDateDropdown(!showDateDropdown)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-sm text-white"
                            >
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>
                                    {selectedDate === 'all' ? 'All Time' : 
                                     selectedDate === 'today' ? 'Today' :
                                     selectedDate === 'yesterday' ? 'Yesterday' :
                                     selectedDate}
                                </span>
                                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showDateDropdown && (
                                <div className="absolute top-full right-0 mt-2 bg-[#252525] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl min-w-[180px] max-h-64 overflow-y-auto">
                                    <button
                                        onClick={() => {
                                            setSelectedDate('all');
                                            setShowDateDropdown(false);
                                        }}
                                        className={`w-full p-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between text-sm ${selectedDate === 'all' ? 'bg-white/5' : ''}`}
                                    >
                                        <span className="text-white">All Time</span>
                                        {selectedDate === 'all' && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedDate('today');
                                            setShowDateDropdown(false);
                                        }}
                                        className={`w-full p-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between text-sm ${selectedDate === 'today' ? 'bg-white/5' : ''}`}
                                    >
                                        <span className="text-white">Today</span>
                                        {selectedDate === 'today' && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedDate('yesterday');
                                            setShowDateDropdown(false);
                                        }}
                                        className={`w-full p-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between text-sm ${selectedDate === 'yesterday' ? 'bg-white/5' : ''}`}
                                    >
                                        <span className="text-white">Yesterday</span>
                                        {selectedDate === 'yesterday' && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        )}
                                    </button>
                                    {availableDates.length > 0 && (
                                        <>
                                            <div className="h-px bg-white/10 my-1" />
                                            {availableDates.map((date) => (
                                                <button
                                                    key={date}
                                                    onClick={() => {
                                                        setSelectedDate(date);
                                                        setShowDateDropdown(false);
                                                    }}
                                                    className={`w-full p-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between text-sm ${selectedDate === date ? 'bg-white/5' : ''}`}
                                                >
                                                    <span className="text-white">{date}</span>
                                                    {selectedDate === date && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                    )}
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                    
                    {/* Section 1: Big Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-[#252525] to-[#1f1f1f] rounded-xl p-4 border border-white/5 hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-1.5 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                    <Video className="w-4 h-4 text-blue-400" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1 leading-none">{loading ? '...' : displayStats.totalVideos}</p>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Videos</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#252525] to-[#1f1f1f] rounded-xl p-4 border border-white/5 hover:border-green-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-1.5 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                    <DollarSign className="w-4 h-4 text-green-400" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-green-400 mb-1 leading-none">{loading ? '...' : formatInr(displayStats.totalCost)}</p>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Cost</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#252525] to-[#1f1f1f] rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-1.5 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                    <TrendingUp className="w-4 h-4 text-purple-400" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1 leading-none">{loading ? '...' : formatInr(displayStats.avgCost)}</p>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avg per Video</p>
                        </div>
                    </div>

                    {/* Section 2: Quick Breakdown */}
                    {displayStats.totalVideos > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            {/* Resolution Breakdown */}
                            <div className="bg-gradient-to-br from-[#252525] to-[#1f1f1f] rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Monitor className="w-4 h-4 text-blue-400" />
                                    <p className="text-sm font-semibold text-white">Resolution</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-8 rounded-lg overflow-hidden flex bg-[#1a1a1a] border border-white/5">
                                        {displayStats.resolutionCounts['720p'] > 0 && (
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-[10px] font-semibold text-white"
                                                style={{ width: `${(displayStats.resolutionCounts['720p'] / resolutionTotal) * 100}%` }}
                                            >
                                                {displayStats.resolutionCounts['720p'] > 0 && `${displayStats.resolutionCounts['720p']}`}
                                            </div>
                                        )}
                                        {displayStats.resolutionCounts['1080p'] > 0 && (
                                            <div 
                                                className="bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-[10px] font-semibold text-white"
                                                style={{ width: `${(displayStats.resolutionCounts['1080p'] / resolutionTotal) * 100}%` }}
                                            >
                                                {displayStats.resolutionCounts['1080p'] > 0 && `${displayStats.resolutionCounts['1080p']}`}
                                            </div>
                                        )}
                                        {displayStats.resolutionCounts['4k'] > 0 && (
                                            <div 
                                                className="bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-[10px] font-semibold text-white"
                                                style={{ width: `${(displayStats.resolutionCounts['4k'] / resolutionTotal) * 100}%` }}
                                            >
                                                {displayStats.resolutionCounts['4k'] > 0 && `${displayStats.resolutionCounts['4k']}`}
                                            </div>
                                        )}
                                        {resolutionTotal === 0 && (
                                            <div className="flex-1 flex items-center justify-center text-[10px] text-gray-500">
                                                No data
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded bg-blue-500"></div>
                                            <span>720p</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded bg-purple-500"></div>
                                            <span>1080p</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded bg-orange-500"></div>
                                            <span>4K</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sound Breakdown */}
                            <div className="bg-gradient-to-br from-[#252525] to-[#1f1f1f] rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Film className="w-4 h-4 text-green-400" />
                                    <p className="text-sm font-semibold text-white">Audio</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-3 border border-green-500/20">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="p-1 bg-green-500/30 rounded">
                                                <Volume2 className="w-3.5 h-3.5 text-green-400" />
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold text-white mb-0.5">{loading ? '...' : displayStats.withSound}</p>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">With Sound</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/10 rounded-lg p-3 border border-gray-500/20">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="p-1 bg-gray-500/30 rounded">
                                                <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold text-white mb-0.5">{loading ? '...' : displayStats.withoutSound}</p>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Without Sound</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default UsageDetails;
