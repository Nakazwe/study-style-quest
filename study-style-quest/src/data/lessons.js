// Mini-lessons used by every study technique.
// Each fact is written from one existing quiz question (`q` is its index in questions.js),
// so the lesson teaches exactly what the Recall Check measures and adds no new claims.
//
// fact fields:
//   q        index of the matching question in questions[subject][form]
//   branch   mind-map branch id ('A' or 'B')
//   concept  short card label for the mind map
//   text     the sentence shown in the lesson notes
//   blank    fill-in sentence for Recall Forest (exactly one ____)
//   answers  accepted answers for the blank
//   rejects  (optional) real words one slip away from an answer that must still be marked wrong
//   keywords phrases that show the idea was covered in a Feynman explanation (any one counts)

export const READ_SECONDS = 30
export const MIN_EXPLANATION_WORDS = 12

function fact(q, branch, concept, text, blank, answers, keywords, rejects = []) {
  return { q, branch, concept, text, blank, answers, keywords, rejects }
}

export const LESSONS = {
  maths: {
    form1: {
      topic: 'Fractions, percentages and simple equations',
      branches: { A: 'Fractions & percentages', B: 'Solving equations' },
      facts: [
        fact(0, 'A', 'Adding fractions', 'Fractions with the same denominator add by adding the numerators: 3/4 + 1/4 = 4/4 = 1.', '3/4 + 1/4 = ____', ['1', '4/4', 'one'], ['numerator', 'denominator', '4/4']),
        fact(1, 'A', 'Percentages', 'To find a percentage of a number, divide by 100 and multiply: 25% of 80 = 80 ÷ 100 × 25 = 20.', '25% of 80 = ____', ['20', 'twenty'], ['percent', 'per cent', 'percentage', 'divide by 100']),
        fact(7, 'A', 'Decimals to fractions', '0.75 means 75 hundredths, which simplifies to 3/4.', '0.75 as a fraction is ____', ['3/4', '75/100'], ['hundredth', '75/100', 'decimal']),
        fact(2, 'B', 'Solving by subtracting', 'To solve x + 7 = 12, subtract 7 from both sides: x = 5.', 'If x + 7 = 12, then x = ____', ['5', 'five'], ['subtract', 'take away', 'minus 7', 'both sides']),
        fact(8, 'B', 'Solving by dividing', 'To solve 3x = 18, divide both sides by 3: x = 6.', 'If 3x = 18, then x = ____', ['6', 'six'], ['divide', 'division', 'divided']),
      ],
    },
    form2: {
      topic: 'Factors, multiples and averages',
      branches: { A: 'Factors, multiples & roots', B: 'Averages' },
      facts: [
        fact(0, 'A', 'LCM', 'The LCM (lowest common multiple) of 4 and 6 is 12 — the smallest number both divide into.', 'The LCM of 4 and 6 is ____', ['12', 'twelve'], ['lcm', 'lowest common multiple', 'multiple']),
        fact(4, 'A', 'HCF', 'The HCF (highest common factor) of 12 and 18 is 6 — the biggest number that divides both.', 'The HCF of 12 and 18 is ____', ['6', 'six'], ['hcf', 'highest common factor', 'factor']),
        fact(1, 'A', 'Square roots', 'The square root of 144 is 12, because 12 × 12 = 144.', 'The square root of 144 is ____', ['12', 'twelve'], ['square root', 'squared', '12 × 12', '12x12']),
        fact(3, 'B', 'Mean', 'The mean is the total divided by how many values there are: (4 + 6 + 8 + 10) ÷ 4 = 7.', 'The mean of 4, 6, 8 and 10 is ____', ['7', 'seven'], ['mean', 'total', 'add them up', 'add up']),
        fact(7, 'B', 'Mode', 'The mode is the value that appears most often: in 2, 3, 3, 4, 5, 5, 5 the mode is 5.', 'The mode of 2, 3, 3, 4, 5, 5, 5 is ____', ['5', 'five'], ['mode', 'most often', 'most common', 'appears the most']),
      ],
    },
    form3: {
      topic: 'Algebra and trigonometry',
      branches: { A: 'Algebra', B: 'Trigonometry' },
      facts: [
        fact(1, 'A', 'Factorising', 'x² + 5x + 6 factorises to (x + 2)(x + 3), because 2 + 3 = 5 and 2 × 3 = 6.', 'x² + 5x + 6 = (x + 2)(x + ____)', ['3', 'three'], ['factorise', 'factorize', 'factorising', 'brackets']),
        fact(4, 'A', 'Expanding brackets', 'Expanding (x + 3)(x − 2) multiplies every term: x² − 2x + 3x − 6 = x² + x − 6.', '(x + 3)(x − 2) = x² + x − ____', ['6', 'six'], ['expand', 'every term', 'multiply out']),
        fact(8, 'A', 'Two solutions', 'x² − 9 = 0 means x² = 9, so x = 3 or x = −3, written x = ±3.', 'If x² − 9 = 0, then x = ±____', ['3', 'three'], ['±', 'plus or minus', 'negative', 'two answers', 'two solutions']),
        fact(2, 'B', 'sin 30°', 'sin 30° = 0.5 (one half).', 'sin 30° = ____', ['0.5', '1/2', 'half', 'one half', '.5'], ['sin', 'sine']),
        fact(7, 'B', 'cos 60°', 'cos 60° = 0.5 — the same value as sin 30°.', 'cos 60° = ____', ['0.5', '1/2', 'half', 'one half', '.5'], ['cos', 'cosine']),
      ],
    },
    form4: {
      topic: 'Matrices, vectors and money',
      branches: { A: 'Matrices & vectors', B: 'Financial maths' },
      facts: [
        fact(0, 'A', 'Determinant', 'The determinant of [[a, b], [c, d]] is ad − bc, so for [[1, 2], [3, 4]] it is 1×4 − 2×3 = −2.', 'The determinant of [[1, 2], [3, 4]] is ____', ['-2', 'minus 2', 'negative 2'], ['determinant', 'ad - bc', 'ad-bc']),
        fact(2, 'A', 'Vector magnitude', 'The magnitude of vector (3, 4) is √(3² + 4²) = 5.', 'The magnitude of vector (3, 4) is ____', ['5', 'five'], ['magnitude', 'length of the vector', 'pythagoras']),
        fact(7, 'A', 'Translation', 'Translating (2, 3) by vector (1, −2) adds the parts: (2 + 1, 3 − 2) = (3, 1).', 'Translating (2, 3) by (1, −2) gives (3, ____)', ['1', 'one'], ['translat', 'move the point', 'add the vector']),
        fact(1, 'B', 'Compound interest', 'Compound interest earns interest on interest: K1000 at 10% becomes K1100, then K1210 — K210 interest after 2 years.', 'K1000 at 10% compound interest for 2 years earns K____', ['210'], ['compound', 'interest on interest', 'interest on the interest']),
        fact(8, 'B', 'Simple interest', 'Simple interest = principal × rate × time: K500 × 8% × 3 years = K120.', 'Simple interest on K500 at 8% for 3 years is K____', ['120'], ['simple interest', 'principal', 'rate', 'prt']),
      ],
    },
  },

  english: {
    form1: {
      topic: 'Parts of speech and punctuation',
      branches: { A: 'Parts of speech', B: 'Punctuation' },
      facts: [
        fact(0, 'A', 'Noun', 'A noun names a person, place or thing — in "The dog ran fast", dog is the noun.', 'A ____ names a person, place or thing.', ['noun'], ['noun', 'naming word']),
        fact(6, 'A', 'Adjective', 'An adjective describes a noun — in "The tall girl smiled", tall is the adjective.', 'An ____ describes a noun.', ['adjective'], ['adjective', 'describing word']),
        fact(9, 'A', 'Verb', 'A verb is an action or doing word — in "The bird sings sweetly", sings is the verb.', 'A ____ is an action or doing word.', ['verb'], ['verb', 'action word', 'doing word']),
        fact(1, 'B', 'Question mark', 'A question ends with a question mark (?).', 'A question ends with a ____ mark.', ['question'], ['question mark']),
        fact(7, 'B', 'Comma', 'A comma (,) shows a short pause in a sentence.', 'A ____ shows a short pause in a sentence.', ['comma'], ['comma', 'pause']),
      ],
    },
    form2: {
      topic: 'Grammar and writing techniques',
      branches: { A: 'Grammar', B: 'Writing techniques' },
      facts: [
        fact(0, 'A', 'Past tense', 'The past tense of "run" is "ran" — it is an irregular verb.', 'The past tense of "run" is ____', ['ran'], ['past tense', 'ran']),
        fact(5, 'A', 'Comparatives', 'The comparative of "good" is "better", and the superlative is "best".', 'The comparative form of "good" is ____', ['better'], ['comparative', 'better']),
        fact(7, 'A', 'Adverb', 'An adverb describes a verb — in "She walked slowly", slowly is the adverb.', 'An ____ describes how a verb is done.', ['adverb'], ['adverb', 'describes a verb', 'describes the verb']),
        fact(3, 'B', 'Simile', 'A simile compares two things using "like" or "as": "He runs like the wind."', 'A ____ compares two things using "like" or "as".', ['simile'], ['simile', 'like or as', 'like the wind']),
        fact(4, 'B', 'Topic sentence', 'A topic sentence introduces the main idea of a paragraph.', 'A ____ sentence introduces the main idea of a paragraph.', ['topic'], ['topic sentence', 'main idea']),
      ],
    },
    form3: {
      topic: 'Literary devices and voice',
      branches: { A: 'Literary devices', B: 'Active & passive voice' },
      facts: [
        fact(0, 'A', 'Personification', 'Personification gives human actions to non-human things: "The wind whispered."', '"The wind whispered" is an example of ____', ['personification'], ['personification', 'human action', 'human qualities']),
        fact(3, 'A', 'Alliteration', 'Alliteration repeats the same consonant sound at the start of nearby words: "Peter Piper picked".', '____ repeats consonant sounds at the start of words.', ['alliteration'], ['alliteration', 'same sound', 'consonant sound']),
        fact(5, 'A', 'Metaphor', 'A metaphor says one thing is another, without "like" or "as": "Life is a journey."', '"Life is a journey" is a ____', ['metaphor'], ['metaphor', 'is a journey', 'one thing is another']),
        fact(8, 'B', 'Active voice', 'In the active voice the subject does the action: "The chef cooked the meal."', 'In the ____ voice, the subject performs the action.', ['active'], ['active', 'subject does', 'subject performs']),
        fact(1, 'B', 'Passive voice', 'In the passive voice the action is done to the subject: "The meal was cooked by the chef."', 'In the ____ voice, the action is done to the subject.', ['passive'], ['passive', 'was cooked', 'done to']),
      ],
    },
    form4: {
      topic: 'Persuasion and hidden meaning',
      branches: { A: 'Persuasive writing', B: 'Hidden meaning' },
      facts: [
        fact(2, 'A', 'Counter-argument', 'A counter-argument is an opposing view that you raise and then refute.', 'A ____ is an opposing view you raise and then refute.', ['counter-argument', 'counterargument'], ['counter-argument', 'counterargument', 'opposing view', 'refute']),
        fact(6, 'A', 'Rhetorical question', 'A rhetorical question engages the reader and makes them think — no answer is expected.', 'A ____ question makes the reader think without expecting an answer.', ['rhetorical'], ['rhetorical', 'makes them think', 'makes the reader think']),
        fact(8, 'A', 'Formal writing', 'Formal writing avoids contractions: write "do not" instead of "don\'t".', 'Formal writing avoids ____ like "don\'t".', ['contractions', 'contraction'], ['contraction', 'formal', 'do not']),
        fact(1, 'B', 'Implicit meaning', 'Implicit meaning is hinted at but not directly stated — the reader has to infer it.', '____ meaning is hinted at but not directly stated.', ['implicit', 'implied'], ['implicit', 'implied', 'infer', 'not directly stated']),
        fact(9, 'B', 'Foreshadowing', 'Foreshadowing hints at events that will happen later in a story.', '____ hints at events that happen later in a story.', ['foreshadowing'], ['foreshadow', 'hints at', 'later in the story', 'future events']),
      ],
    },
  },

  science: {
    form1: {
      topic: 'Forces, energy and plants',
      branches: { A: 'Forces & energy', B: 'Plants' },
      facts: [
        fact(3, 'A', 'Newtons', 'Force is measured in newtons (N).', 'Force is measured in ____', ['newtons', 'newton', 'n'], ['newton']),
        fact(9, 'A', 'Gravity', 'Gravity is the force that pulls objects towards the Earth.', '____ pulls objects towards the Earth.', ['gravity'], ['gravity', 'pulls objects']),
        fact(4, 'A', 'Elastic energy', 'A stretched rubber band stores elastic potential energy.', 'A stretched rubber band stores ____ potential energy.', ['elastic'], ['elastic', 'stretched', 'rubber band'], ['plastic']),
        fact(2, 'B', 'Carbon dioxide', 'During photosynthesis, plants take in carbon dioxide from the air.', 'Plants take in ____ during photosynthesis.', ['carbon dioxide', 'co2'], ['carbon dioxide', 'co2']),
        fact(6, 'B', 'Roots', 'Roots absorb water and minerals from the soil.', 'Roots absorb water and ____ from the soil.', ['minerals', 'mineral', 'mineral salts'], ['root', 'minerals', 'from the soil']),
      ],
    },
    form2: {
      topic: 'Body systems, energy and light',
      branches: { A: 'Body systems', B: 'Energy & light' },
      facts: [
        fact(2, 'A', 'Lungs', 'The lungs exchange gases: oxygen goes in and carbon dioxide comes out.', 'The ____ exchange oxygen and carbon dioxide.', ['lungs', 'lung'], ['lung', 'exchange gases', 'gas exchange']),
        fact(6, 'A', 'Kidneys', 'The kidneys filter waste from the blood.', 'The ____ filter waste from the blood.', ['kidneys', 'kidney'], ['kidney', 'filter']),
        fact(9, 'A', 'Mitochondria', 'Mitochondria are the "powerhouse" of the cell — they release energy.', '____ are the powerhouse of the cell.', ['mitochondria', 'mitochondrion'], ['mitochondri', 'powerhouse']),
        fact(1, 'B', 'Kinetic energy', 'A moving car has kinetic energy — the energy of movement.', 'A moving car has ____ energy.', ['kinetic'], ['kinetic', 'energy of movement']),
        fact(8, 'B', 'Refraction', 'Refraction is the bending of light as it passes from one material into another.', '____ is the bending of light between materials.', ['refraction'], ['refract', 'bending of light', 'light bends'], ['retraction', 'retractions', 'reflection', 'reflections']),
      ],
    },
    form3: {
      topic: 'Chemical reactions and physics laws',
      branches: { A: 'Chemistry', B: 'Physics' },
      facts: [
        fact(2, 'A', 'Neutral pH', 'A neutral solution has a pH of 7; below 7 is acidic and above 7 is alkaline.', 'A neutral solution has a pH of ____', ['7', 'seven'], ['ph', 'neutral']),
        fact(7, 'A', 'Ionic bond', 'An ionic bond forms when electrons are transferred from one atom to another.', 'An ionic bond forms when electrons are ____ between atoms.', ['transferred', 'transfered', 'given', 'moved'], ['ionic', 'transfer']),
        fact(8, 'A', 'Catalyst', 'A catalyst speeds up a reaction without being used up.', 'A ____ speeds up a reaction without being used up.', ['catalyst'], ['catalyst', 'speeds up']),
        fact(1, 'B', "Newton's second law", "Newton's second law: force = mass × acceleration (F = ma).", 'Force = mass × ____', ['acceleration'], ['f = ma', 'f=ma', 'mass times acceleration', 'mass × acceleration', 'acceleration']),
        fact(9, 'B', 'Resistance', 'Electrical resistance is measured in ohms.', 'Resistance is measured in ____', ['ohms', 'ohm'], ['ohm', 'resistance']),
      ],
    },
    form4: {
      topic: 'Electricity and radioactivity',
      branches: { A: 'Electricity', B: 'Radioactivity' },
      facts: [
        fact(1, 'A', "Ohm's law", "Ohm's law: voltage = current × resistance (V = IR).", 'V = I × ____', ['r', 'resistance'], ['v = ir', 'v=ir', 'voltage']),
        fact(7, 'A', 'Electrical power', 'Electrical power = voltage × current (P = VI).', 'P = V × ____', ['i', 'current'], ['p = vi', 'p=vi', 'power']),
        fact(2, 'B', 'Gamma rays', 'Gamma radiation is the most penetrating type of radiation.', '____ radiation is the most penetrating.', ['gamma'], ['gamma', 'penetrat']),
        fact(4, 'B', 'Nuclear fission', 'Nuclear fission is the splitting of atomic nuclei, which releases energy.', 'Nuclear fission is the ____ of atomic nuclei.', ['splitting', 'split'], ['fission', 'split']),
        fact(5, 'B', 'Half-life', 'Half-life is the time for half the radioactive atoms in a sample to decay.', 'Half-life is the time for ____ the atoms to decay.', ['half'], ['half-life', 'half life', 'decay']),
      ],
    },
  },

  biology: {
    form1: {
      topic: 'Cells and plants',
      branches: { A: 'Cell structure', B: 'Plants' },
      facts: [
        fact(0, 'A', 'The cell', 'The cell is the basic unit of life — every living thing is made of cells.', 'The ____ is the basic unit of life.', ['cell'], ['basic unit', 'unit of life', 'made of cells', 'building block']),
        fact(2, 'A', 'Cell membrane', 'The cell membrane controls what enters and leaves the cell.', 'The cell ____ controls what enters and leaves the cell.', ['membrane'], ['membrane']),
        fact(8, 'A', 'Nucleus', 'The nucleus controls the activities of the cell.', 'The ____ controls the activities of the cell.', ['nucleus'], ['nucleus']),
        fact(1, 'B', 'Photosynthesis', 'For photosynthesis, plants need water, carbon dioxide and light.', 'Photosynthesis needs water, carbon dioxide and ____', ['light', 'sunlight'], ['photosynthesis', 'sunlight', 'light']),
        fact(7, 'B', 'Roots', 'Roots absorb water and minerals from the soil.', 'Roots absorb water and ____ from the soil.', ['minerals', 'mineral', 'mineral salts'], ['root', 'minerals']),
      ],
    },
    form2: {
      topic: 'Transport and blood',
      branches: { A: 'Movement in & out of cells', B: 'Blood' },
      facts: [
        fact(0, 'A', 'Osmosis', 'Osmosis is the movement of water from a high to a low water concentration through a membrane.', '____ is the movement of water across a membrane.', ['osmosis'], ['osmosis']),
        fact(4, 'A', 'Diffusion', 'Diffusion is the movement of particles from a high to a low concentration.', '____ moves particles from high to low concentration.', ['diffusion'], ['diffusion', 'diffuse']),
        fact(9, 'A', 'Active transport', 'Active transport moves substances against the concentration gradient and uses energy.', 'Active transport moves substances against the gradient and uses ____', ['energy', 'atp'], ['active transport', 'uses energy', 'against the']),
        fact(2, 'B', 'Red blood cells', 'Red blood cells carry oxygen around the body.', 'Red blood cells carry ____', ['oxygen', 'o2'], ['red blood', 'carry oxygen']),
        fact(5, 'B', 'White blood cells', 'White blood cells fight infection.', 'White blood cells fight ____', ['infection', 'infections', 'disease', 'germs'], ['white blood', 'infection'], ['injection', 'injections', 'inflection', 'inflections']),
      ],
    },
    form3: {
      topic: 'Coordination and evolution',
      branches: { A: 'Coordination', B: 'Evolution' },
      facts: [
        fact(2, 'A', 'Cerebellum', 'The cerebellum controls balance.', 'The ____ controls balance.', ['cerebellum'], ['cerebellum', 'balance']),
        fact(5, 'A', 'Reflex action', 'A reflex action is an automatic response to a stimulus.', 'A reflex is an ____ response to a stimulus.', ['automatic'], ['reflex', 'automatic']),
        fact(4, 'A', 'Hypothalamus', 'The hypothalamus regulates body temperature.', 'The ____ regulates body temperature.', ['hypothalamus'], ['hypothalamus', 'body temperature']),
        fact(3, 'B', 'Natural selection', 'Natural selection means the best-adapted organisms survive and reproduce.', 'Natural selection means the best ____ organisms survive.', ['adapted', 'adapted organisms'], ['natural selection', 'adapted', 'survival of the'], ['adopted']),
        fact(8, 'B', 'Evolution', 'Evolution is the gradual change in species over many generations.', 'Evolution is gradual change in species over many ____', ['generations', 'generation'], ['evolution', 'evolve', 'generations']),
      ],
    },
    form4: {
      topic: 'Genetics and homeostasis',
      branches: { A: 'Genetics', B: 'Homeostasis' },
      facts: [
        fact(4, 'A', 'Gene', 'A gene is a section of DNA that codes for a protein.', 'A ____ is a section of DNA that codes for a protein.', ['gene'], ['gene', 'section of dna', 'codes for']),
        fact(6, 'A', 'Allele', 'An allele is a different version of a gene.', 'An ____ is a different version of a gene.', ['allele'], ['allele', 'version of a gene']),
        fact(0, 'A', 'Meiosis', 'Meiosis makes gametes with half the number of chromosomes.', 'Meiosis makes gametes with ____ the chromosomes.', ['half'], ['meiosis', 'gamete']),
        fact(3, 'B', 'Insulin', 'Insulin lowers blood sugar.', 'Insulin ____ blood sugar.', ['lowers', 'reduces', 'decreases', 'lower', 'reduce'], ['insulin', 'blood sugar', 'glucose']),
        fact(8, 'B', 'ADH', 'ADH controls how much water the kidneys reabsorb.', 'ADH controls water reabsorption in the ____', ['kidneys', 'kidney'], ['adh', 'reabsor']),
      ],
    },
  },
}

export function formKeyFor(form) {
  if (typeof form !== 'string') return 'form1'
  const match = form.match(/\d+/)
  return match ? `form${match[0]}` : 'form1'
}

export function getLesson(subject, form) {
  return LESSONS[subject]?.[formKeyFor(form)] ?? null
}
