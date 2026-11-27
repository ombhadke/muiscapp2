import { Music2, MoreHorizontal } from 'lucide-react'
export default function PlaylistCard({ playlist, active, onSelect, onMenu }) {
  return <button className={`playlist-card ${active ? 'playlist-selected' : ''}`} onClick={onSelect}>
    <span className="playlist-art"><Music2 size={22}/></span>
    <span className="playlist-card-copy"><strong>{playlist.name}</strong><small>{playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}</small></span>
    <span className="playlist-menu" onClick={e => { e.stopPropagation(); onMenu(e) }}><MoreHorizontal size={18}/></span>
  </button>
}
