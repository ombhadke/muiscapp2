import { Plus, Check, Play, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
export default function SongRow({ song, index, onAdd, added, onPlay, onRemove, onMoveUp, onMoveDown, itemCount = 0, inPlaylist = false, active = false }) {
  return <div className={`song-row ${active ? 'song-active' : ''}`}>
    <button className="track-play" onClick={() => onPlay(song)} aria-label={`Play ${song.title}`}><Play size={15} fill="currentColor"/></button>
    <div className="song-info"><strong>{song.title}</strong><span>{song.artist}</span></div>
    <span className="genre-pill">{song.genre}</span>
    <span className="song-duration">{formatDuration(song.duration)}</span>
    {inPlaylist ? <div className="row-actions">
      <button className="icon-button compact" disabled={index === 0} onClick={onMoveUp} aria-label="Move up"><ChevronUp size={17}/></button>
      <button className="icon-button compact" disabled={index >= itemCount - 1} onClick={onMoveDown} aria-label="Move down"><ChevronDown size={17}/></button>
      <button className="icon-button compact danger-hover" onClick={onRemove} aria-label="Remove song"><Trash2 size={16}/></button>
    </div> : <button className={`add-button ${added ? 'is-added' : ''}`} onClick={onAdd} disabled={added} aria-label={added ? 'Already added' : 'Add to playlist'}>{added ? <Check size={17}/> : <Plus size={17}/>}</button>}
  </div>
}
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60), s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
