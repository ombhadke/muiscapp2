import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { AudioLines, Disc3, Headphones, ListMusic, Plus, Search, SlidersHorizontal, Sparkles, X, Pencil, Trash2 } from 'lucide-react'
import Button from './components/Button'
import Input from './components/Input'
import Modal from './components/Modal'
import SongRow from './components/SongRow'
import PlaylistCard from './components/PlaylistCard'
import PlayerBar from './components/PlayerBar'

const STORAGE_KEY = 'mixtape-playlists-v1'
const initialPlaylists = [
  { id: 'p1', name: 'Late night drives', songs: ['s1','s3','s6'] },
  { id: 'p2', name: 'On repeat', songs: ['s2','s5','s9','s11'] }
]
const makeId = () => `p${Date.now()}${Math.random().toString(16).slice(2,6)}`

export default function App() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [playlists, setPlaylists] = useState(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : initialPlaylists }
    catch { return initialPlaylists }
  })
  const [selectedId, setSelectedId] = useState('p1')
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All genres')
  const [modal, setModal] = useState(null)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [nowPlaying, setNowPlaying] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [libraryTab, setLibraryTab] = useState('All songs')

  useEffect(() => {
    let alive = true
    axios.get('/songs.json').then(({ data }) => { if (alive) setSongs(data) })
      .catch(() => { if (alive) setLoadError('Could not load songs. Please refresh to try again.') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists)) }, [playlists])

  const selected = playlists.find(p => p.id === selectedId) || playlists[0]
  const selectedSongs = (selected?.songs || []).map(id => songs.find(s => s.id === id)).filter(Boolean)
  const genres = ['All genres', ...new Set(songs.map(s => s.genre))]
  const filteredSongs = useMemo(() => songs.filter(s => {
    const q = search.trim().toLowerCase()
    return (!q || `${s.title} ${s.artist} ${s.genre}`.toLowerCase().includes(q)) && (genre === 'All genres' || s.genre === genre)
  }), [songs, search, genre])
  const totalSeconds = selectedSongs.reduce((sum, s) => sum + s.duration, 0)
  const durationLabel = totalSeconds >= 3600 ? `${Math.floor(totalSeconds/3600)} hr ${Math.round((totalSeconds%3600)/60)} min` : `${Math.round(totalSeconds/60)} min`

  function flash(message) { setNotice(message); window.clearTimeout(flash.timer); flash.timer = window.setTimeout(() => setNotice(''), 2600) }
  function openCreate() { setName(''); setEditingId(null); setModal('create') }
  function openRename(p) { setName(p.name); setEditingId(p.id); setModal('rename') }
  function savePlaylist(e) {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) return flash('Please enter a playlist name.')
    if (playlists.some(p => p.name.toLowerCase() === clean.toLowerCase() && p.id !== editingId)) return flash('Playlist names must be unique.')
    if (editingId) setPlaylists(prev => prev.map(p => p.id === editingId ? {...p, name: clean} : p))
    else { const p = { id: makeId(), name: clean, songs: [] }; setPlaylists(prev => [...prev, p]); setSelectedId(p.id) }
    setModal(null); flash(editingId ? 'Playlist renamed.' : 'Playlist created.')
  }
  function deletePlaylist(p) {
    if (!window.confirm(`Delete “${p.name}”? This cannot be undone.`)) return
    const next = playlists.filter(x => x.id !== p.id); setPlaylists(next)
    if (selectedId === p.id) setSelectedId(next[0]?.id || '')
    flash('Playlist deleted.')
  }
  function addSong(song) {
    if (!selected) { flash('Create a playlist first.'); return }
    if (selected.songs.includes(song.id)) return
    setPlaylists(prev => prev.map(p => p.id === selected.id ? {...p, songs: [...p.songs, song.id]} : p))
    flash(`Added “${song.title}”.`)
  }
  function removeSong(song) { setPlaylists(prev => prev.map(p => p.id === selected.id ? {...p, songs: p.songs.filter(id => id !== song.id)} : p)) }
  function moveSong(index, direction) {
    const target = index + direction
    if (target < 0 || target >= selected.songs.length) return
    const reordered = [...selected.songs]; [reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    setPlaylists(prev => prev.map(p => p.id === selected.id ? {...p, songs: reordered} : p))
  }
  function playSong(song) { setNowPlaying(song); setPlaying(true) }
  function stepTrack(direction) {
    const list = selectedSongs.length ? selectedSongs : songs
    if (!list.length) return
    const index = list.findIndex(s => s.id === nowPlaying?.id)
    setNowPlaying(list[(index + direction + list.length) % list.length]); setPlaying(true)
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><AudioLines size={21}/></span><span>mixtape<span className="brand-dot">.</span></span></div>
      <div className="side-label">YOUR SPACE</div>
      <button className="side-link side-link-active"><Disc3 size={18}/> Music library</button>
      <button className="side-link" onClick={() => setLibraryTab('All songs')}><Headphones size={18}/> Discover</button>
      <div className="sidebar-section-head"><span className="side-label">YOUR PLAYLISTS</span><button className="tiny-add" onClick={openCreate} aria-label="Create playlist"><Plus size={16}/></button></div>
      <div className="sidebar-playlists">
        {playlists.map(p => <button key={p.id} className={`sidebar-playlist ${selected?.id === p.id ? 'sidebar-playlist-active' : ''}`} onClick={() => setSelectedId(p.id)}><span className="playlist-mini"><ListMusic size={15}/></span><span>{p.name}</span></button>)}
        {!playlists.length && <p className="sidebar-empty">Your playlists will show up here.</p>}
      </div>
      <div className="sidebar-bottom"><div className="mini-profile"><span className="avatar">M</span><span><strong>Your music space</strong><small>Personal library</small></span></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Music library</strong></div><div className="topbar-right"><span className="status-dot"/> Your collection</div></header>
      <div className="content-wrap">
        <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={13}/> YOUR SOUND, YOUR WAY</div><h1>Find your <em>rhythm.</em></h1><p>Build the perfect soundtrack for every version of you.</p></div><div className="welcome-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-disc"><AudioLines size={34}/></div><span className="art-spark spark-a">✳</span><span className="art-spark spark-b">✦</span></div></section>

        <section className="playlist-section">
          <div className="section-heading"><div><div className="eyebrow muted">MADE BY YOU</div><h2>Your playlists <span className="count-bubble">{playlists.length}</span></h2></div><Button onClick={openCreate}><Plus size={16}/> New playlist</Button></div>
          {playlists.length ? <div className="playlist-grid">{playlists.map(p => <div className="playlist-card-wrap" key={p.id}><PlaylistCard playlist={p} active={selected?.id === p.id} onSelect={() => setSelectedId(p.id)} onMenu={() => openRename(p)}/><div className="card-tools"><button onClick={() => openRename(p)} aria-label={`Rename ${p.name}`}><Pencil size={13}/></button><button onClick={() => deletePlaylist(p)} aria-label={`Delete ${p.name}`}><Trash2 size={13}/></button></div></div>)}</div> : <div className="empty-playlists"><ListMusic size={25}/><strong>No playlists yet</strong><span>Create a playlist to start collecting your favourite tracks.</span><Button onClick={openCreate}><Plus size={15}/> Create playlist</Button></div>}
        </section>

        <section className="workspace-grid">
          <div className="panel library-panel">
            <div className="panel-heading"><div><div className="eyebrow muted">THE GOOD STUFF</div><h2>Song library <span className="count-bubble">{songs.length}</span></h2></div><span className="panel-caption">Explore your tracks</span></div>
            <div className="library-tools"><div className="search-wrap"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search songs, artists..." aria-label="Search songs"/></div><div className="select-wrap"><SlidersHorizontal size={15}/><select value={genre} onChange={e => setGenre(e.target.value)} aria-label="Filter by genre">{genres.map(g => <option key={g}>{g}</option>)}</select></div></div>
            <div className="table-labels"><span>TRACK</span><span>GENRE</span><span>TIME</span><span/></div>
            {loading ? <div className="state-box"><div className="loader"/><span>Loading your music...</span></div> : loadError ? <div className="state-box">{loadError}</div> : filteredSongs.length ? <div className="song-list">{filteredSongs.map(song => <SongRow key={song.id} song={song} added={!!selected?.songs.includes(song.id)} onAdd={() => addSong(song)} onPlay={playSong} active={nowPlaying?.id === song.id}/>)}</div> : <div className="state-box"><Search size={22}/><strong>No results found</strong><span>Try another title, artist or genre.</span><button className="text-button" onClick={() => {setSearch('');setGenre('All genres')}}>Clear filters</button></div>}
            <div className="panel-foot"><span>Showing {filteredSongs.length} of {songs.length} tracks</span><span className="live-indicator"><i/> LIBRARY READY</span></div>
          </div>

          <div className="panel detail-panel">
            <div className="panel-heading"><div><div className="eyebrow muted">YOUR MIX</div><h2>{selected?.name || 'Playlist details'}</h2></div>{selected && <button className="icon-button" onClick={() => openRename(selected)} aria-label="Rename playlist"><Pencil size={16}/></button>}</div>
            {selected ? <>
              <div className="playlist-summary"><div className="summary-art"><AudioLines size={30}/></div><div><strong>{selectedSongs.length} {selectedSongs.length === 1 ? 'song' : 'songs'}</strong><span>{durationLabel} total listening</span></div></div>
              <div className="detail-list-head"><span>IN THIS PLAYLIST</span><span>{selectedSongs.length} TRACKS</span></div>
              {selectedSongs.length ? <div className="detail-song-list">{selectedSongs.map((song, i) => <SongRow key={song.id} song={song} index={i} itemCount={selectedSongs.length} inPlaylist onPlay={playSong} onRemove={() => removeSong(song)} onMoveUp={() => moveSong(i,-1)} onMoveDown={() => moveSong(i,1)} active={nowPlaying?.id === song.id}/>)}</div> : <div className="empty-detail"><div className="empty-icon"><ListMusic size={23}/></div><strong>A little quiet in here.</strong><span>Add songs from your library to bring this playlist to life.</span></div>}
              <div className="detail-bottom"><button className="text-button" onClick={() => {setSearch('');setGenre('All genres');document.querySelector('.library-panel')?.scrollIntoView({behavior:'smooth',block:'start'})}}>＋ Add songs from library</button><button className="delete-link" onClick={() => deletePlaylist(selected)}><Trash2 size={14}/> Delete playlist</button></div>
            </> : <div className="empty-detail"><ListMusic size={25}/><strong>No playlist selected</strong><span>Create a playlist to get started.</span></div>}
          </div>
        </section>
        <div className="footer-note"><span>♫</span> Made for the moments in between.</div>
      </div>
    </main>
    <PlayerBar song={nowPlaying} playing={playing} onToggle={() => {if (nowPlaying) setPlaying(v => !v)}} onNext={() => stepTrack(1)} onPrevious={() => stepTrack(-1)}/>
    {notice && <div className="toast" role="status">{notice}</div>}
    {modal && <Modal title={modal === 'create' ? 'Create a playlist' : 'Rename playlist'} onClose={() => setModal(null)}><form onSubmit={savePlaylist}><p className="modal-copy">{modal === 'create' ? 'Give your new collection a name. You can add tracks right after.' : 'Choose a new name for this playlist.'}</p><Input autoFocus label="PLAYLIST NAME" placeholder="e.g. Sunday mornings" value={name} onChange={e => setName(e.target.value)} maxLength={40}/><div className="modal-actions"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button type="submit">{modal === 'create' ? 'Create playlist' : 'Save changes'}</Button></div></form></Modal>}
  </div>
}
