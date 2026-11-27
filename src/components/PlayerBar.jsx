import { Play, Pause, SkipBack, SkipForward, Volume2, AudioLines } from 'lucide-react'
import { formatDuration } from './SongRow'
export default function PlayerBar({ song, playing, onToggle, onNext, onPrevious }) {
  return <footer className="player-bar">
    <div className="player-track"><div className="player-cover"><AudioLines size={20}/></div><div className="song-info"><strong>{song?.title || 'Nothing playing'}</strong><span>{song?.artist || 'Choose a track to begin'}</span></div></div>
    <div className="player-controls"><div className="control-buttons"><button className="player-icon" onClick={onPrevious} aria-label="Previous"><SkipBack size={18} fill="currentColor"/></button><button className="play-main" onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause size={17} fill="currentColor"/> : <Play size={17} fill="currentColor"/>}</button><button className="player-icon" onClick={onNext} aria-label="Next"><SkipForward size={18} fill="currentColor"/></button></div><div className="progress-track"><span/></div></div>
    <div className="player-extra"><Volume2 size={18}/><span>{song ? formatDuration(song.duration) : '—:—'}</span></div>
  </footer>
}
