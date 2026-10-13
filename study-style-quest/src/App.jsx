import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase }       from './lib/supabase'
import { BIOME_MAP }      from './data/biomes'
import Auth               from './screens/Auth'
import Welcome            from './screens/Welcome'
import SubjectSelector    from './screens/SubjectSelector'
import SubjectPicker      from './screens/SubjectPicker'
import WorldMap           from './screens/WorldMap'
import Guardian           from './screens/Guardian'
import RecallChallenge    from './screens/RecallChallenge'
import StudyDNA           from './screens/StudyDNA'

const SCREENS = ['welcome', 'selector', 'picker', 'map', 'guardian', 'recall', 'dna']

function toHistoryRow(row) {
  return {
    biome:      row.biome,
    subject:    row.subject,
    form:       row.form,
    score:      row.score,
    studyScore: row.study_score ?? null,
    timestamp:  row.timestamp,
  }
}

function isMissingColumnError(error) {
  return error?.code === 'PGRST204' || /column/i.test(error?.message ?? '')
}

function testedBiomesFor(history, subject, form) {
  return new Set(history.filter((row) => row.subject === subject && row.form === form).map((row) => row.biome))
}

const variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -24 },
}

export default function App() {
  const [user, setUser]                       = useState(null)
  const [authLoading, setAuthLoading]         = useState(true)
  const [screenIndex, setScreenIndex]         = useState(0)
  const [selectedBiome, setSelectedBiome]     = useState('mindmap')
  const [selectedSubject, setSelectedSubject] = useState('maths')
  const [studentProfile, setStudentProfile]   = useState(null)
  const [sessionResults, setSessionResults]   = useState(null)
  const [studyResult, setStudyResult]         = useState(null)
  const [history, setHistory]                 = useState([])

  const userId = user?.id ?? null

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') setUser(session?.user ?? null)
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setHistory([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load every saved session once per signed-in user so Study DNA compares techniques on real data.
  useEffect(() => {
    if (!userId) return

    let cancelled = false

    // select('*') so history still loads before the optional study_score column exists.
    supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load session history:', error.message)
          return
        }
        setHistory((data ?? []).map(toHistoryRow))
      })

    return () => { cancelled = true }
  }, [userId])

  // Advance only if we're still on the screen that asked to move on.
  // A double click (or a click on a screen that is animating out) would otherwise skip a screen.
  function advanceFrom(screenId) {
    setScreenIndex((i) => (SCREENS[i] === screenId ? Math.min(i + 1, SCREENS.length - 1) : i))
  }

  function goTo(screenId) {
    const index = SCREENS.indexOf(screenId)
    if (index === -1) return
    setSessionResults(null)
    setStudyResult(null)
    setScreenIndex(index)
  }

  function handleStudyComplete(result) {
    if (!result || !Number.isFinite(result.score)) return
    setStudyResult(result)
    advanceFrom('guardian')
  }

  async function handleSaveProfile(profile) {
    if (!profile?.form) return

    setStudentProfile(profile)
    if (!user) return

    const { error } = await supabase.from('profiles').upsert({
      id: user.id, email: user.email, form: profile.form, subjects: profile.subjects,
    })
    if (error) console.error('Failed to save profile:', error.message)
  }

  async function handleScore(checkResults) {
    if (!checkResults || !Number.isFinite(checkResults.score)) return

    const results = { ...checkResults, study: studyResult }
    setSessionResults(results)
    setHistory((prev) => [
      ...prev,
      {
        biome: results.biome, subject: results.subject, form: results.form,
        score: results.score, studyScore: studyResult?.score ?? null, timestamp: results.timestamp,
      },
    ])

    if (!user) return

    const baseRow = {
      user_id: user.id, subject: results.subject, biome: results.biome, form: results.form,
      score: results.score, correct: results.correct, total: results.total,
      avg_response_ms: results.avgResponseMs,
    }

    const { error } = await supabase.from('sessions').insert({
      ...baseRow,
      study_score:  studyResult?.score ?? null,
      study_metric: studyResult?.metric ?? null,
    })
    if (!error) return

    // Guard: the study columns are optional. If the table doesn't have them yet, save the core row anyway.
    if (isMissingColumnError(error)) {
      const retry = await supabase.from('sessions').insert(baseRow)
      if (retry.error) console.error('Failed to save session:', retry.error.message)
      return
    }
    console.error('Failed to save session:', error.message)
  }

  const screenProps = {
    welcome:  { onNext: () => advanceFrom('welcome') },
    selector: { onNext: () => advanceFrom('selector'), onSave: handleSaveProfile },
    picker:   { onNext: () => advanceFrom('picker'), onSubject: setSelectedSubject, profile: studentProfile },
    map:      {
      onNext: () => advanceFrom('map'), onSelect: setSelectedBiome, selected: selectedBiome, profile: studentProfile,
      testedBiomes: testedBiomesFor(history, selectedSubject, studentProfile?.form),
    },
    guardian: { onNext: handleStudyComplete, biome: selectedBiome, subject: selectedSubject, profile: studentProfile },
    recall:   { onNext: () => advanceFrom('recall'), biome: selectedBiome, subject: selectedSubject, onScore: handleScore, profile: studentProfile },
    dna:      {
      biome: selectedBiome,
      subject: selectedSubject,
      profile: studentProfile,
      results: sessionResults,
      history,
      onTryAnother:    (biomeId) => {
        if (typeof biomeId === 'string' && BIOME_MAP[biomeId]) setSelectedBiome(biomeId)
        goTo('map')
      },
      onChangeSubject: () => goTo('picker'),
    },
  }

  const Components = {
    welcome: Welcome, selector: SubjectSelector, picker: SubjectPicker,
    map: WorldMap, guardian: Guardian, recall: RecallChallenge, dna: StudyDNA,
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          style={{ color: '#6b7280', fontSize: 14 }}
        >
          Loading...
        </motion.p>
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          <ActiveComponent {...screenProps[id]} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
