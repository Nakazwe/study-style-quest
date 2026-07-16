import { useState, useEffect } from 'react'
import { supabase }       from './lib/supabase'
import Auth               from './screens/Auth'
import Welcome            from './screens/Welcome'
import SubjectSelector    from './screens/SubjectSelector'
import SubjectPicker      from './screens/SubjectPicker'
import WorldMap           from './screens/WorldMap'
import Guardian           from './screens/Guardian'
import RecallChallenge    from './screens/RecallChallenge'
import StudyDNA           from './screens/StudyDNA'

const SCREENS = ['welcome', 'selector', 'picker', 'map', 'guardian', 'recall', 'dna']

export default function App() {
  const [user, setUser]                       = useState(null)
  const [authLoading, setAuthLoading]         = useState(true)
  const [screenIndex, setScreenIndex]         = useState(0)
  const [selectedBiome, setSelectedBiome]     = useState('mindmap')
  const [selectedSubject, setSelectedSubject] = useState('maths')
  const [studentProfile, setStudentProfile]   = useState(null)
  const [sessionResults, setSessionResults]   = useState(null)

  // Check if user is already logged in
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null)
    setAuthLoading(false)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      setUser(session?.user ?? null)
    }
    if (event === 'SIGNED_OUT') {
      setUser(null)
    }
  })

  return () => subscription.unsubscribe()
}, [])

  const next = () => setScreenIndex(i => Math.min(i + 1, SCREENS.length - 1))

  async function handleSaveProfile(profile) {
    setStudentProfile(profile)
    if (!user) return
    await supabase.from('profiles').upsert({
      id:       user.id,
      email:    user.email,
      form:     profile.form,
      subjects: profile.subjects,
    })
  }

  async function handleScore(results) {
    setSessionResults(results)
    if (!user) return
    await supabase.from('sessions').insert({
      user_id:         user.id,
      subject:         results.subject,
      biome:           results.biome,
      form:            results.form,
      score:           results.score,
      correct:         results.correct,
      total:           results.total,
      avg_response_ms: results.avgResponseMs,
    })
  }

  const screenProps = {
    welcome:  { onNext: next },
    selector: { onNext: next, onSave: handleSaveProfile },
    picker:   { onNext: next, onSubject: setSelectedSubject, profile: studentProfile },
    map:      { onNext: next, onSelect: setSelectedBiome, selected: selectedBiome, profile: studentProfile },
    guardian: { onNext: next, biome: selectedBiome, subject: selectedSubject, profile: studentProfile },
    recall:   { onNext: next, biome: selectedBiome, subject: selectedSubject, onScore: handleScore, profile: studentProfile },
    dna:      { biome: selectedBiome, subject: selectedSubject, profile: studentProfile, results: sessionResults },
  }

  const Components = {
    welcome: Welcome, selector: SubjectSelector, picker: SubjectPicker,
    map: WorldMap, guardian: Guardian, recall: RecallChallenge, dna: StudyDNA,
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Auth onAuth={setUser} />
      </div>
    )
  }

  const id = SCREENS[screenIndex]
  const ActiveComponent = Components[id]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <ActiveComponent {...screenProps[id]} />
    </div>
  )
}
