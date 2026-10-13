import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeAnswer, isAnswerCorrect, gradeRecall, gradeExplanation } from './grading.js'
import { LESSONS, getLesson, formKeyFor } from '../data/lessons.js'
import questions from '../data/questions.js'

test('normalizeAnswer handles case, articles, punctuation, dashes and "x ="', () => {
  assert.equal(normalizeAnswer('  The Cell. '), 'cell')
  assert.equal(normalizeAnswer('Carbon  Dioxide'), 'carbondioxide')
  assert.equal(normalizeAnswer('CO₂'), 'co2')
  assert.equal(normalizeAnswer('x = 5'), '5')
  assert.equal(normalizeAnswer('−2'), '-2')
  assert.equal(normalizeAnswer('Counter-argument'), 'counterargument')
  assert.equal(normalizeAnswer(null), '')
})

test('isAnswerCorrect accepts synonyms and small spelling slips in long words only', () => {
  assert.equal(isAnswerCorrect('membrane', ['membrane']), true)
  assert.equal(isAnswerCorrect('membrain', ['membrane']), true)
  assert.equal(isAnswerCorrect('mitocondria', ['mitochondria']), true)
  assert.equal(isAnswerCorrect('sunlight', ['light', 'sunlight']), true)
  assert.equal(isAnswerCorrect('3/4', ['3/4', '75/100']), true)
  assert.equal(isAnswerCorrect('4', ['5']), false)
  assert.equal(isAnswerCorrect('verb', ['noun']), false)
  assert.equal(isAnswerCorrect('', ['cell']), false)
  assert.equal(isAnswerCorrect('   ', ['cell']), false)
  assert.throws(() => isAnswerCorrect('cell', []), /accepted answer/)
})

test('gradeRecall totals blanks and guards length mismatch', () => {
  const facts = [{ answers: ['cell'] }, { answers: ['membrane'] }, { answers: ['nucleus'] }]
  const result = gradeRecall(['cell', 'wall', ''], facts)
  assert.equal(result.correct, 1)
  assert.equal(result.total, 3)
  assert.equal(result.score, 33)
  assert.deepEqual(result.results.map((r) => r.correct), [true, false, false])
  assert.throws(() => gradeRecall(['cell'], facts), /same length/)
  assert.throws(() => gradeRecall([], []), /at least one fact/)
  assert.throws(() => gradeRecall('cell', facts), /must be an array/)
})

test('gradeExplanation finds covered ideas and gaps', () => {
  const lesson = getLesson('biology', 'Form 1')
  const text = 'Every living thing is made of cells. The membrane decides what goes in and out, and the nucleus is the boss of the cell.'
  const result = gradeExplanation(text, lesson.facts)
  assert.deepEqual(result.covered, [0, 1, 2])
  assert.deepEqual(result.missed, [3, 4])
  assert.equal(result.score, 60)
  assert.equal(result.simple, true)
  assert.throws(() => gradeExplanation(42, lesson.facts), /must be text/)
  assert.throws(() => gradeExplanation('hi', []), /at least one fact/)
})

test('gradeExplanation matches formulas written without spaces', () => {
  const lesson = getLesson('science', 'Form 4')
  const result = gradeExplanation('V=IR tells you the voltage. P=VI gives power.', lesson.facts)
  assert.deepEqual(result.covered, [0, 1])
})

test('formKeyFor reads the form number and defaults safely', () => {
  assert.equal(formKeyFor('Form 3'), 'form3')
  assert.equal(formKeyFor(undefined), 'form1')
  assert.equal(formKeyFor('nonsense'), 'form1')
})

test('every lesson is complete and every fact points at a real question', () => {
  const subjects = ['maths', 'english', 'science', 'biology']
  for (const subject of subjects) {
    for (const form of ['form1', 'form2', 'form3', 'form4']) {
      const lesson = LESSONS[subject]?.[form]
      const where = `${subject} ${form}`
      assert.ok(lesson, `${where} missing`)
      assert.equal(lesson.facts.length, 5, `${where} should have 5 facts`)

      const branchIds = Object.keys(lesson.branches)
      assert.deepEqual(branchIds, ['A', 'B'], `${where} branches`)

      const usedQuestions = new Set()
      for (const f of lesson.facts) {
        assert.ok(questions[subject][form][f.q], `${where} q${f.q} does not exist`)
        assert.ok(!usedQuestions.has(f.q), `${where} q${f.q} used twice`)
        usedQuestions.add(f.q)
        assert.ok(branchIds.includes(f.branch), `${where} ${f.concept} has unknown branch`)
        assert.equal(f.blank.split('____').length, 2, `${where} ${f.concept} blank needs exactly one ____`)
        assert.ok(f.answers.length > 0 && f.keywords.length > 0, `${where} ${f.concept} needs answers and keywords`)
        assert.ok(f.answers.every((a) => normalizeAnswer(a)), `${where} ${f.concept} has an empty answer after normalising`)
        assert.ok(isAnswerCorrect(f.answers[0], f.answers), `${where} ${f.concept} first answer must self-match`)
      }

      for (const id of branchIds) {
        assert.ok(lesson.facts.some((f) => f.branch === id), `${where} branch ${id} unused`)
      }

      // The lesson text must teach every one of its own key ideas.
      const selfExplained = gradeExplanation(lesson.facts.map((f) => f.text).join(' '), lesson.facts)
      assert.equal(selfExplained.score, 100, `${where} lesson text misses keywords: ${selfExplained.missed.map((i) => lesson.facts[i].concept)}`)
    }
  }
})
