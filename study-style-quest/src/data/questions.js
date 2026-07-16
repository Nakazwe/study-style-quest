const questions = {
  maths: {
    form1: [
      { q: 'What is the value of 3/4 + 1/4?', opts: ['1/2', '1', '3/8', '4/8'], ans: 1 },
      { q: 'What is 25% of 80?', opts: ['15', '20', '25', '30'], ans: 1 },
      { q: 'Solve for x: x + 7 = 12', opts: ['x = 4', 'x = 5', 'x = 6', 'x = 19'], ans: 1 },
      { q: 'What is the perimeter of a square with side 6cm?', opts: ['12cm', '18cm', '24cm', '36cm'], ans: 2 },
    ],
    form2: [
      { q: 'What is the LCM of 4 and 6?', opts: ['8', '10', '12', '24'], ans: 2 },
      { q: 'What is the square root of 144?', opts: ['10', '11', '12', '13'], ans: 2 },
      { q: 'Solve: 2x + 3 = 11', opts: ['x = 3', 'x = 4', 'x = 5', 'x = 7'], ans: 1 },
      { q: 'What is the mean of 4, 6, 8, 10?', opts: ['6', '7', '8', '9'], ans: 2 },
    ],
    form3: [
      { q: 'Solve simultaneously: x + y = 5 and x - y = 1', opts: ['x=2,y=3', 'x=3,y=2', 'x=4,y=1', 'x=1,y=4'], ans: 1 },
      { q: 'Factorise: x² + 5x + 6', opts: ['(x+2)(x+3)', '(x+1)(x+6)', '(x+5)(x+1)', '(x-2)(x-3)'], ans: 0 },
      { q: 'What is sin 30°?', opts: ['0', '0.5', '√3/2', '1'], ans: 1 },
      { q: 'Find the gradient of y = 3x + 2', opts: ['2', '3', '5', '6'], ans: 1 },
    ],
    form4: [
      { q: 'If A = [[1,2],[3,4]], what is the determinant?', opts: ['-2', '2', '-4', '10'], ans: 0 },
      { q: 'What is compound interest on K1000 at 10% for 2 years?', opts: ['K200', 'K210', 'K220', 'K100'], ans: 1 },
      { q: 'A vector AB = (3,4). What is its magnitude?', opts: ['3', '4', '5', '7'], ans: 2 },
      { q: 'What does a cumulative frequency curve help you find?', opts: ['Mean', 'Mode', 'Median', 'Range'], ans: 2 },
    ],
  },

  english: {
    form1: [
      { q: 'Which word is a noun in: "The dog ran fast"?', opts: ['The', 'dog', 'ran', 'fast'], ans: 1 },
      { q: 'What punctuation ends a question?', opts: ['Full stop', 'Comma', 'Question mark', 'Exclamation mark'], ans: 2 },
      { q: 'Choose the correct spelling:', opts: ['Recieve', 'Receive', 'Receve', 'Receeve'], ans: 1 },
      { q: 'What is a synonym for "happy"?', opts: ['Sad', 'Angry', 'Joyful', 'Tired'], ans: 2 },
    ],
    form2: [
      { q: 'What is the past tense of "run"?', opts: ['Runned', 'Ran', 'Running', 'Runs'], ans: 1 },
      { q: 'Identify the adjective: "The tall boy jumped"', opts: ['The', 'tall', 'boy', 'jumped'], ans: 1 },
      { q: 'What is an antonym for "ancient"?', opts: ['Old', 'Modern', 'Slow', 'Large'], ans: 1 },
      { q: 'Which sentence uses a simile?', opts: ['He is a lion', 'She sings beautifully', 'He runs like the wind', 'The sun is bright'], ans: 2 },
    ],
    form3: [
      { q: 'What literary device is used in "The wind whispered"?', opts: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], ans: 2 },
      { q: 'What is the purpose of a topic sentence?', opts: ['To end a paragraph', 'To introduce a paragraph\'s main idea', 'To provide evidence', 'To give examples'], ans: 1 },
      { q: 'Convert to passive: "The chef cooked the meal"', opts: ['The meal was cooked by the chef', 'The chef was cooking the meal', 'The meal cooked itself', 'The chef had cooked the meal'], ans: 0 },
      { q: 'What is a "thesis statement"?', opts: ['A question in an essay', 'The main argument of an essay', 'A conclusion sentence', 'A supporting detail'], ans: 1 },
    ],
    form4: [
      { q: 'What is the effect of short sentences in writing?', opts: ['Creates confusion', 'Creates rhythm and impact', 'Makes writing formal', 'Adds more detail'], ans: 1 },
      { q: 'What does "implicit" mean in a text?', opts: ['Clearly stated', 'Hinted at but not directly stated', 'Repeated for emphasis', 'Written in simple language'], ans: 1 },
      { q: 'In an argumentative essay, what is a "counter-argument"?', opts: ['Your main point', 'An opposing view you then refute', 'A supporting example', 'Your conclusion'], ans: 1 },
      { q: 'What is the purpose of a discursive essay?', opts: ['To tell a story', 'To describe a place', 'To explore different views on a topic', 'To give instructions'], ans: 2 },
    ],
  },

  science: {
    form1: [
      { q: 'What are the three states of matter?', opts: ['Solid, liquid, plasma', 'Solid, liquid, gas', 'Liquid, gas, energy', 'Solid, gas, steam'], ans: 1 },
      { q: 'What organ pumps blood around the body?', opts: ['Lungs', 'Liver', 'Heart', 'Kidney'], ans: 2 },
      { q: 'What gas do plants absorb during photosynthesis?', opts: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], ans: 2 },
      { q: 'What is the unit of force?', opts: ['Watt', 'Joule', 'Newton', 'Metre'], ans: 2 },
    ],
    form2: [
      { q: 'What is the chemical symbol for water?', opts: ['WA', 'HO', 'H2O', 'W2O'], ans: 2 },
      { q: 'What type of energy does a moving car have?', opts: ['Potential', 'Chemical', 'Kinetic', 'Thermal'], ans: 2 },
      { q: 'What is the function of the lungs?', opts: ['Digest food', 'Filter blood', 'Exchange gases', 'Pump blood'], ans: 2 },
      { q: 'What is an ecosystem?', opts: ['A type of rock', 'Living things and their environment', 'A weather system', 'A food chain'], ans: 1 },
    ],
    form3: [
      { q: 'What happens to particles when a substance is heated?', opts: ['They slow down', 'They disappear', 'They move faster', 'They get heavier'], ans: 2 },
      { q: 'What is Newton\'s second law?', opts: ['Every action has a reaction', 'Force = mass × acceleration', 'Objects at rest stay at rest', 'Energy cannot be created'], ans: 1 },
      { q: 'What is the pH of a neutral solution?', opts: ['0', '7', '10', '14'], ans: 1 },
      { q: 'What type of bond holds water molecules together?', opts: ['Ionic', 'Covalent', 'Hydrogen', 'Metallic'], ans: 1 },
    ],
    form4: [
      { q: 'What is the role of mitochondria in a cell?', opts: ['Store DNA', 'Produce energy (ATP)', 'Make proteins', 'Control cell division'], ans: 1 },
      { q: 'What is Ohm\'s Law?', opts: ['V = IR', 'P = IV', 'F = ma', 'E = mc²'], ans: 0 },
      { q: 'What type of radiation has the highest penetrating power?', opts: ['Alpha', 'Beta', 'Gamma', 'Infrared'], ans: 2 },
      { q: 'What is the process by which rocks are broken down?', opts: ['Erosion', 'Weathering', 'Sedimentation', 'Fossilisation'], ans: 1 },
    ],
  },

  biology: {
    form1: [
      { q: 'What is the basic unit of life?', opts: ['Tissue', 'Organ', 'Cell', 'System'], ans: 2 },
      { q: 'What do plants need for photosynthesis?', opts: ['Water, CO2, light', 'Water, O2, light', 'CO2, O2, soil', 'Light, soil, air'], ans: 0 },
      { q: 'What is the function of the cell membrane?', opts: ['Produce energy', 'Control what enters and leaves the cell', 'Store genetic material', 'Make proteins'], ans: 1 },
      { q: 'Which organ is responsible for digestion?', opts: ['Heart', 'Brain', 'Stomach', 'Kidney'], ans: 2 },
    ],
    form2: [
      { q: 'What is osmosis?', opts: ['Movement of solutes through a membrane', 'Movement of water from high to low concentration', 'Movement of gases in lungs', 'Movement of blood in veins'], ans: 1 },
      { q: 'What does DNA stand for?', opts: ['Deoxyribose Nucleic Acid', 'Double Nucleic Acid', 'Deoxyribonucleic Acid', 'Dynamic Nucleic Assembly'], ans: 2 },
      { q: 'What is the function of red blood cells?', opts: ['Fight infection', 'Carry oxygen', 'Clot blood', 'Produce hormones'], ans: 1 },
      { q: 'What type of reproduction requires two parents?', opts: ['Asexual', 'Binary fission', 'Sexual', 'Budding'], ans: 2 },
    ],
    form3: [
      { q: 'What happens during mitosis?', opts: ['Cell produces gametes', 'Cell divides into two identical cells', 'Cell produces energy', 'Cell absorbs nutrients'], ans: 1 },
      { q: 'What is the role of enzymes?', opts: ['Store energy', 'Carry oxygen', 'Speed up chemical reactions', 'Fight disease'], ans: 2 },
      { q: 'Which part of the brain controls balance?', opts: ['Cerebrum', 'Medulla', 'Cerebellum', 'Hypothalamus'], ans: 2 },
      { q: 'What is natural selection?', opts: ['Farmers choosing crops', 'Survival of the best adapted organisms', 'Random mutations only', 'Artificial breeding'], ans: 1 },
    ],
    form4: [
      { q: 'What is the difference between meiosis and mitosis?', opts: ['Meiosis produces 2 cells, mitosis 4', 'Meiosis produces gametes with half chromosomes', 'Mitosis is only in plants', 'Meiosis produces identical cells'], ans: 1 },
      { q: 'What is homeostasis?', opts: ['The study of hormones', 'Maintaining a stable internal environment', 'The process of digestion', 'Cell division process'], ans: 1 },
      { q: 'Which blood type is the universal donor?', opts: ['Type A', 'Type B', 'Type AB', 'Type O'], ans: 3 },
      { q: 'What is the role of insulin in the body?', opts: ['Increase blood sugar', 'Lower blood sugar', 'Break down fats', 'Fight infection'], ans: 1 },
    ],
  },
}

export default questions