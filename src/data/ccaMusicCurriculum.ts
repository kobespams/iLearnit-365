import { JSSLessonTopic, CBTExamConfig } from '../types';

export const CCA_MUSIC_CURRICULUM: JSSLessonTopic[] = [
  // ==================== JSS 1 CCA MUSIC LESSONS ====================
  {
    id: 'cca-jss1-00',
    file: 'CCA_Music_JSS/JSS1/00_INDEX_AND_TEACHER_GUIDE.txt',
    title: 'JSS1 CCA Music Curriculum & Teacher Guide',
    level: 'JSS1',
    term: 1,
    recommendedWeek: 1,
    summary: 'Comprehensive Junior Secondary Year 1 Master Teaching Guide for Cultural and Creative Arts (Music). Covers baseline acoustic concepts, staff notation fundamentals, solfa ear-training drills, Nigerian traditional organology, and weekly classroom singing pacing across 36 academic weeks.',
    keyFormulas: [
      'Sound Qualities: Pitch (Hz), Dynamics (dB), Timbre (Waveform), Duration (Time)',
      'Treble Clef Lines: E - G - B - D - F ("Every Good Boy Deserves Favour")',
      'Treble Clef Spaces: F - A - C - E ("FACE")',
      'Relative Note Values: 1 Semibreve = 2 Minims = 4 Crotchets = 8 Quavers = 16 Semiquavers'
    ],
    workedExamples: [
      {
        problem: 'How do you distinguish musical sound from noise in a classroom demonstration?',
        solution: 'Produce sound from a tuned tuning fork or recorder (regular, periodic vibration frequency with pleasant tone) versus clapping two uneven timber blocks or scraping metal (irregular, non-periodic waveform causing auditory discomfort).'
      }
    ],
    teacherGuide: 'Pacing: 3 Terms (36 Weeks). Utilize physical percussion (Sekere, Claves, Agogo) and pitch pipes for solfa interval training before introducing abstract notation on blackboards.',
    practiceQuestions: [
      {
        question: 'Name the four primary properties of musical sound.',
        answer: 'Pitch, Dynamics (Intensity), Timbre (Tone Color), and Duration.'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 1,
        weekTitle: 'Orientation & Introduction to Sound',
        focusSubtopics: ['Sound vs Noise', 'Properties of Musical Sound', 'Sources of sound in our environment'],
        weeklyObjective: 'Distinguish between musical sound and noise and classify environmental sounds.',
        teachingActivities: ['Audio playback comparison', 'Tuning fork demonstration'],
        weeklyAssignment: 'Identify 5 natural and 5 artificial sound sources in your neighborhood.',
        status: 'completed'
      },
      {
        term: 1,
        weekNumber: 2,
        weekTitle: 'The Musical Staff (Stave) & Clefs',
        focusSubtopics: ['5 lines and 4 spaces', 'Treble (G) Clef', 'Bass (F) Clef', 'Ledger lines'],
        weeklyObjective: 'Draw the musical stave and identify note names on lines and spaces in treble clef.',
        teachingActivities: ['Stave drawing drills', 'Mnemonic blackboard games (EGBDF / FACE)'],
        weeklyAssignment: 'Draw a treble stave and label notes on all five lines and four spaces.',
        status: 'current'
      }
    ]
  },
  {
    id: 'cca-jss1-01',
    file: 'CCA_Music_JSS/JSS1/01_Introduction_to_Sound_and_Music.txt',
    title: '01. Fundamentals of Music & Sound Properties',
    level: 'JSS1',
    term: 1,
    recommendedWeek: 2,
    summary: 'In-depth exploration of the nature of sound, difference between musical tones and noise, sources of acoustic vibrations, and the four fundamental characteristics: pitch, dynamics, timbre, and duration.',
    keyFormulas: [
      'Pitch = Vibration Frequency (High vs Low)',
      'Dynamics = Vibration Amplitude (Loud vs Soft)',
      'Timbre = Harmonic Overtone Signature (Tone Colour)',
      'Duration = Sustain Time (Length of Note)'
    ],
    workedExamples: [
      {
        problem: 'Explain why a flute and a trumpet sound completely different even when playing the exact same pitch at the same loudness.',
        solution: 'Because of Timbre (tone color). Each instrument generates different harmonic overtones based on its material, mouthpiece construction, and acoustic resonance.'
      }
    ],
    teacherGuide: 'Play audio samples of various solo instruments and ask students to identify them purely by their timbre.',
    practiceQuestions: [
      {
        question: 'What is the acoustic parameter that determines the pitch of a note?',
        answer: 'Frequency of vibration (measured in Hertz / cycles per second).'
      },
      {
        question: 'Define noise in relation to sound waves.',
        answer: 'Noise is sound caused by irregular, non-periodic vibrations that produce an unpleasant or jarring sensation to the auditory senses.'
      }
    ]
  },
  {
    id: 'cca-jss1-02',
    file: 'CCA_Music_JSS/JSS1/02_The_Musical_Staff_and_Clefs.txt',
    title: '02. The Musical Stave, Treble & Bass Clefs',
    level: 'JSS1',
    term: 1,
    recommendedWeek: 3,
    summary: 'Comprehensive analysis of the 5-line 4-space musical stave, ledger lines, Treble (G) Clef and Bass (F) Clef pitch identification, letter names, and standard clef drawing techniques.',
    keyFormulas: [
      'Treble Clef Lines: E4, G4, B4, D5, F5 (EGBDF)',
      'Treble Clef Spaces: F4, A4, C5, E5 (FACE)',
      'Bass Clef Lines: G2, B2, D3, F3, A3 (GBDFA)',
      'Bass Clef Spaces: A2, C3, E3, G3 (ACEG)'
    ],
    workedExamples: [
      {
        problem: 'Identify the note located on the 3rd line of the Treble Stave and the note on the 2nd space of the Bass Stave.',
        solution: '3rd line of Treble Stave = B (Middle line - Every Good Boy). 2nd space of Bass Stave = C (All Cows Eat Grass).'
      }
    ],
    teacherGuide: 'Have students draw treble and bass clefs on manuscript paper. Focus on starting the G-clef loop exactly on line 2.',
    practiceQuestions: [
      {
        question: 'Why is the Treble Clef also called the G-Clef?',
        answer: 'Because its central spiral wraps directly around the second line of the stave, establishing that line as the pitch G above middle C (G4).'
      }
    ]
  },
  {
    id: 'cca-jss1-03',
    file: 'CCA_Music_JSS/JSS1/03_Notes_Values_and_Rests.txt',
    title: '03. Musical Notes, Relative Values & Rests',
    level: 'JSS1',
    term: 1,
    recommendedWeek: 4,
    summary: 'The systematic breakdown of Western rhythmic notation: Semibreve, Minim, Crotchet, Quaver, Semiquaver, their corresponding rests, and mathematical duration relationships.',
    keyFormulas: [
      '1 Semibreve (4 beats) = 2 Minims (2 beats each)',
      '1 Minim (2 beats) = 2 Crotchets (1 beat each)',
      '1 Crotchet (1 beat) = 2 Quavers (1/2 beat each)',
      '1 Quaver (1/2 beat) = 2 Semiquavers (1/4 beat each)',
      'Dotted Note Rule: A dot increases the note length by exactly half its original value (e.g., Dotted Minim = 2 + 1 = 3 beats)'
    ],
    workedExamples: [
      {
        problem: 'How many quavers are equal in value to one dotted semibreve?',
        solution: 'A semibreve = 4 beats. A dot adds half (2 beats), totaling 6 beats. Since 1 quaver = 1/2 beat, 6 beats ÷ (1/2) = 12 quavers.'
      }
    ],
    teacherGuide: 'Use rhythmic clapping and rhythm pyramids. Group students to clap polyrhythmic patterns with crotchets and quavers.',
    practiceQuestions: [
      {
        question: 'What is the duration value of a dotted crotchet in standard time?',
        answer: '1 and 1/2 beats (1 + 0.5 = 1.5 crotchet beats).'
      }
    ]
  },
  {
    id: 'cca-jss1-04',
    file: 'CCA_Music_JSS/JSS1/04_Time_Signatures_and_Bars.txt',
    title: '04. Time Signatures, Bar Lines & Metre',
    level: 'JSS1',
    term: 2,
    recommendedWeek: 2,
    summary: 'Study of musical meters: simple duple (2/4), simple triple (3/4), simple quadruple (4/4 or Common Time), bar lines, double bar lines, pulse, and metric accentuation.',
    keyFormulas: [
      'Top Number = Number of beats per measure',
      'Bottom Number = Denominator note value (4 = Crotchet, 2 = Minim, 8 = Quaver)',
      '2/4: Strong - Weak',
      '3/4: Strong - Weak - Weak (Waltz pulse)',
      '4/4: Strong - Weak - Medium - Weak'
    ],
    workedExamples: [
      {
        problem: 'Fill a bar of 3/4 time using three different note values.',
        solution: 'One dotted crotchet (1.5 beats) + one quaver (0.5 beat) + one crotchet (1 beat) = 3 beats total.'
      }
    ],
    teacherGuide: 'Conduct time signatures with standard baton arm movements: down-up for 2/4; down-right-up for 3/4; down-in-out-up for 4/4.',
    practiceQuestions: [
      {
        question: 'What does the symbol "C" represent in a time signature context?',
        answer: 'Common Time, which is equivalent to 4/4 time (four crotchet beats per bar).'
      }
    ]
  },
  {
    id: 'cca-jss1-05',
    file: 'CCA_Music_JSS/JSS1/05_Solfa_Notation_and_Singing_Voices.txt',
    title: '05. Tonic Solfa & Human Voice Classification',
    level: 'JSS1',
    term: 2,
    recommendedWeek: 5,
    summary: 'Tonic solfa singing drills (doh, ray, me, fah, soh, lah, te, doh\'), sight-singing, ear training, vocal health, and voice ranges (Soprano, Alto, Tenor, Bass - SATB).',
    keyFormulas: [
      'Diatonic Solfa Scale: d - r - m - f - s - l - t - d\'',
      'High Female: Soprano | Low Female: Alto',
      'High Male: Tenor | Low Male: Bass'
    ],
    workedExamples: [
      {
        problem: 'Arrange the four standard SATB choir voices from the highest pitch range to the lowest.',
        solution: '1. Soprano (Highest female), 2. Alto (Lowest female), 3. Tenor (Highest male), 4. Bass (Lowest male).'
      }
    ],
    teacherGuide: 'Conduct warm-up vocal arpeggios and test individual student vocal registers for choir section placement.',
    practiceQuestions: [
      {
        question: 'Which singing voice has the lowest vocal register among female singers?',
        answer: 'Alto (Contralto).'
      }
    ]
  },
  {
    id: 'cca-jss1-06',
    file: 'CCA_Music_JSS/JSS1/06_African_Traditional_Instruments.txt',
    title: '06. African & Nigerian Traditional Instruments (Organology)',
    level: 'JSS1',
    term: 3,
    recommendedWeek: 2,
    summary: 'Classification of indigenous Nigerian and African instruments into Idiophones, Membranophones, Aerophones, and Chordophones with cultural contexts.',
    keyFormulas: [
      'Idiophones: Agogo (Bell/Gong), Sekere (Gourd Rattle), Ekwe (Slit Log), Udu (Clay Pot)',
      'Membranophones: Bata Drum, Talking Drum (Gangan/Dundun), Igba',
      'Aerophones: Oja (Flute), Kakaki (Royal Long Trumpet), Algaita (Shawm)',
      'Chordophones: Goge (Bowed Fiddle), Une (Mouth Bow), Garaya (Plucked Lute)'
    ],
    workedExamples: [
      {
        problem: 'Classify the following Nigerian instruments by their acoustic family: Agogo, Kakaki, Gangan, Goge.',
        solution: 'Agogo = Idiophone; Kakaki = Aerophone; Gangan = Membranophone; Goge = Chordophone.'
      }
    ],
    teacherGuide: 'Display live cultural instruments or recorded performance clips showing the Kakaki played for traditional Emirs or the talking drum mimicking Yoruba tonal speech.',
    practiceQuestions: [
      {
        question: 'Which instrument family does the Hausa Kakaki belong to, and what is its primary cultural role?',
        answer: 'It is an Aerophone (brass wind instrument), played primarily as a ceremonial fanfare for royal royalty and traditional emirs.'
      }
    ]
  },

  // ==================== JSS 2 CCA MUSIC LESSONS ====================
  {
    id: 'cca-jss2-00',
    file: 'CCA_Music_JSS/JSS2/00_INDEX_AND_TEACHER_GUIDE.txt',
    title: 'JSS2 CCA Music Curriculum & Intermediate Guide',
    level: 'JSS2',
    term: 1,
    recommendedWeek: 1,
    summary: 'Junior Secondary Year 2 Master Guide. Focuses on major scale construction, key signatures up to 2 sharps/flats, western orchestral instrument families, historical eras (Baroque, Classical, Romantic), Nigerian popular music (Highlife, Juju, Afrobeat, Fuji), and dynamic tempo terms.',
    keyFormulas: [
      'Major Scale Formula: Tone - Tone - Semitone - Tone - Tone - Tone - Semitone (T-T-S-T-T-T-S)',
      'Key Signatures: C (0), G (1# on F#), D (2# on F#, C#), F (1b on Bb)',
      'Orchestra Families: Strings, Woodwinds, Brass, Percussion',
      'Dynamics Spectrum: pp < p < mp < mf < f < ff'
    ],
    workedExamples: [
      {
        problem: 'Explain the difference between a Baroque polyphonic texture and a Classical homophonic texture.',
        solution: 'Baroque polyphony features multiple independent, intertwining melodic lines of equal importance (e.g., Bach fugue). Classical homophony features a clear, prominent single melody supported by chordal accompaniment (e.g., Mozart sonata).'
      }
    ],
    teacherGuide: 'Engage students with keyboard visualization when explaining major scale tone and semitone step distances.',
    practiceQuestions: [
      {
        question: 'State the key signature of D Major.',
        answer: 'Two sharps: F sharp and C sharp (F#, C#).'
      }
    ]
  },
  {
    id: 'cca-jss2-01',
    file: 'CCA_Music_JSS/JSS2/01_Scales_and_Key_Signatures.txt',
    title: '01. Major Scales & Key Signatures (C, G, D, F Major)',
    level: 'JSS2',
    term: 1,
    recommendedWeek: 3,
    summary: 'Construction of major diatonic scales using the T-T-S-T-T-T-S step formula, semitone positions, accidental notation (sharps, flats, naturals), and key signatures.',
    keyFormulas: [
      'Scale Degrees: 1=Tonic, 2=Supertonic, 3=Mediant, 4=Subdominant, 5=Dominant, 6=Submediant, 7=Leading Note, 8=Tonic',
      'Semitones occur between degrees 3-4 and 7-8 in all major scales',
      'G Major = F# | D Major = F#, C# | F Major = Bb'
    ],
    workedExamples: [
      {
        problem: 'Construct the scale of G Major showing why F requires a sharp (#).',
        solution: 'Notes: G - A - B - C - D - E - F# - G. Interval from E to F is a natural semitone, but major scale requires a full tone between degrees 6 & 7; raising F to F# provides the required tone (E to F#) and creates the required semitone between degree 7 (F#) and 8 (G).'
      }
    ],
    teacherGuide: 'Draw keyboard diagrams on the board indicating black keys and white key semitone gaps (B-C and E-F).',
    practiceQuestions: [
      {
        question: 'What is the technical name for the 5th degree of a diatonic scale?',
        answer: 'The Dominant (soh).'
      }
    ]
  },
  {
    id: 'cca-jss2-02',
    file: 'CCA_Music_JSS/JSS2/02_Intervals_and_Chords.txt',
    title: '02. Musical Intervals & Tonic Triads',
    level: 'JSS2',
    term: 1,
    recommendedWeek: 6,
    summary: 'Analysis of melodic and harmonic pitch distances, interval qualities (Major, Minor, Perfect), and the formation of primary tonic triads (Chord I).',
    keyFormulas: [
      'Melodic Interval: Sounded consecutively (in succession)',
      'Harmonic Interval: Sounded simultaneously (together)',
      'Tonic Triad (Chord I): Root (1st) + Major 3rd (3rd) + Perfect 5th (5th)'
    ],
    workedExamples: [
      {
        problem: 'Identify the notes in the tonic triad of F Major.',
        solution: 'Root = F, 3rd = A, 5th = C (F - A - C).'
      }
    ],
    teacherGuide: 'Play intervals on a piano and ask students to distinguish between harmonious consonances and sharp dissonances.',
    practiceQuestions: [
      {
        question: 'What is the interval between Middle C and G above it?',
        answer: 'A Perfect 5th.'
      }
    ]
  },
  {
    id: 'cca-jss2-03',
    file: 'CCA_Music_JSS/JSS2/03_Western_Orchestra_Families.txt',
    title: '03. Western Symphony Orchestra & Instrument Families',
    level: 'JSS2',
    term: 2,
    recommendedWeek: 2,
    summary: 'Detailed examination of the four orchestral families: Strings (Violin, Viola, Cello, Double Bass), Woodwinds (Flute, Oboe, Clarinet, Bassoon), Brass (Trumpet, Horn, Trombone, Tuba), and Percussion (Timpani, Cymbals).',
    keyFormulas: [
      'Strings: Violin (highest) -> Viola -> Cello -> Double Bass (lowest)',
      'Woodwinds with Double Reeds: Oboe and Bassoon',
      'Woodwind with Single Reed: Clarinet and Saxophone',
      'Pitched Percussion: Timpani, Xylophone, Glockenspiel'
    ],
    workedExamples: [
      {
        problem: 'Which instrument in the brass family uses a sliding mechanism instead of finger valves to change pitch?',
        solution: 'The Trombone uses a telescopic slide to alter the tube length and pitch.'
      }
    ],
    teacherGuide: 'Use seating chart diagrams of a modern symphony orchestra to show spatial positioning of each section.',
    practiceQuestions: [
      {
        question: 'Name two orchestral woodwind instruments that use a double vibrating reed.',
        answer: 'Oboe and Bassoon.'
      }
    ]
  },
  {
    id: 'cca-jss2-04',
    file: 'CCA_Music_JSS/JSS2/04_Western_Music_History_Eras.txt',
    title: '04. Historical Eras in Western Music (Baroque, Classical, Romantic)',
    level: 'JSS2',
    term: 2,
    recommendedWeek: 6,
    summary: 'Chronological timeline of Western art music: Baroque (1600-1750; Bach, Handel), Classical (1750-1820; Mozart, Haydn, Beethoven), and Romantic (1820-1900; Chopin, Tchaikovsky).',
    keyFormulas: [
      'Baroque (1600-1750): Polyphony, Basso Continuo, Harpsichord, Bach & Handel',
      'Classical (1750-1820): Homophony, Sonata Form, Balance, Mozart & Haydn',
      'Romantic (1820-1900): Emotion, Nationalism, Tone Poems, Chopin & Tchaikovsky'
    ],
    workedExamples: [
      {
        problem: 'Name the composer often referred to as the "Father of the Symphony" and "Father of the String Quartet".',
        solution: 'Franz Joseph Haydn (Classical period composer).'
      }
    ],
    teacherGuide: 'Play Handel’s "Hallelujah Chorus" alongside Mozart’s "Eine kleine Nachtmusik" to contrast Baroque choral grandiosity with Classical melodic symmetry.',
    practiceQuestions: [
      {
        question: 'Which famous German composer bridged the transition from the Classical to the Romantic period despite becoming completely deaf?',
        answer: 'Ludwig van Beethoven.'
      }
    ]
  },
  {
    id: 'cca-jss2-05',
    file: 'CCA_Music_JSS/JSS2/05_Nigerian_Contemporary_Music_Genres.txt',
    title: '05. Contemporary Nigerian Popular Music Genres',
    level: 'JSS2',
    term: 3,
    recommendedWeek: 2,
    summary: 'Origins, stylistic features, and leading pioneers of Nigerian popular music: Highlife, Juju, Afrobeat, Fuji, and Apala.',
    keyFormulas: [
      'Highlife: Horn section + palm-wine guitars (E.T. Mensah, Rex Lawson, Osita Osadebe)',
      'Juju: Talking drums + electric guitars + praise poetry (King Sunny Ade, Ebenezer Obey)',
      'Afrobeat: Jazz + funk + African rhythm + sociopolitical lyrics (Fela Kuti, Tony Allen)',
      'Fuji: Islamic Were tradition + percussion, no guitars (Sikiru Ayinde Barrister, KWAM 1)',
      'Apala: Acoustic Yoruba folk + Sekere + Agidigbo (Haruna Ishola)'
    ],
    workedExamples: [
      {
        problem: 'How did Alhaji Sikiru Ayinde Barrister develop Fuji music from its traditional roots?',
        solution: 'He transformed the traditional Islamic morning wake-up chant tradition ("Were" or "Ajisari") into a modernized secular dance genre driven by talking drum ensembles and vocal storytelling.'
      }
    ],
    teacherGuide: 'Organize a listening station comparing Highlife rhythm grooves with modern Afrobeat percussion loops.',
    practiceQuestions: [
      {
        question: 'Who created the Afrobeat genre and what was the name of his historic performance sanctuary in Lagos?',
        answer: 'Fela Anikulapo Kuti; The Afrika Shrine.'
      }
    ]
  },
  {
    id: 'cca-jss2-06',
    file: 'CCA_Music_JSS/JSS2/06_Musical_Terms_and_Dynamics.txt',
    title: '06. Musical Terminology, Dynamics & Tempo Markings',
    level: 'JSS2',
    term: 3,
    recommendedWeek: 5,
    summary: 'Italian musical terms used globally for volume control (dynamics: piano, forte, crescendo) and speed regulation (tempo: largo, andante, allegro, presto, accelerando).',
    keyFormulas: [
      'Pianissimo (pp) = Very Soft | Forte (f) = Loud | Fortissimo (ff) = Very Loud',
      'Crescendo (<) = Gradually getting louder | Decrescendo (>) = Gradually getting softer',
      'Largo (Very slow) -> Andante (Walking pace) -> Moderato (Moderate) -> Allegro (Fast & lively) -> Presto (Very fast)',
      'Accelerando = Gradually speeding up | Ritardando / Rallentando = Gradually slowing down'
    ],
    workedExamples: [
      {
        problem: 'Translate the musical direction: "Allegro con brio e crescendo".',
        solution: '"Fast and lively with vigor/spirit, and gradually getting louder".'
      }
    ],
    teacherGuide: 'Have the class sing a familiar tune following hand-held dynamic and tempo cue cards.',
    practiceQuestions: [
      {
        question: 'What Italian term means playing music at a comfortable walking pace?',
        answer: 'Andante.'
      }
    ]
  },

  // ==================== JSS 3 CCA MUSIC LESSONS ====================
  {
    id: 'cca-jss3-00',
    file: 'CCA_Music_JSS/JSS3/00_INDEX_AND_TEACHER_GUIDE.txt',
    title: 'JSS3 CCA Music Curriculum & Advanced BECE Guide',
    level: 'JSS3',
    term: 1,
    recommendedWeek: 1,
    summary: 'Junior Secondary Year 3 Master Guide for BECE preparation. Covers 4-part SATB harmony, musical cadences (Perfect, Plagal, Imperfect, Interrupted), transposition and modulation, African polyrhythmic structures, Nigerian art music pioneers (Fela Sowande, T.K.E. Phillips, Laz Ekwueme), digital audio workstations (DAWs), and music copyright laws.',
    keyFormulas: [
      'Cadences: Perfect (V-I), Plagal (IV-I), Imperfect (Any-V), Interrupted (V-VI)',
      'Voice Parts: Soprano (S), Alto (A), Tenor (T), Bass (B)',
      'Acoustic Metrics: Frequency (Hertz) = Pitch | Amplitude (Decibels) = Volume',
      'Copyright Protection: COSON / MCSN collective licensing & royalty management'
    ],
    workedExamples: [
      {
        problem: 'Why is a Plagal Cadence nicknamed the "Amen Cadence"?',
        solution: 'Because it moves from Subdominant (Chord IV) to Tonic (Chord I), the harmonic sequence universally used to sing "Amen" at the conclusion of traditional Christian hymns.'
      }
    ],
    teacherGuide: 'Administer BECE past questions weekly and conduct 4-part choir ear-training.',
    practiceQuestions: [
      {
        question: 'What chord progression defines an Interrupted (Deceptive) Cadence?',
        answer: 'Chord V (Dominant) resolving to Chord VI (Submediant).'
      }
    ]
  },
  {
    id: 'cca-jss3-01',
    file: 'CCA_Music_JSS/JSS3/01_Advanced_Harmony_and_Cadences.txt',
    title: '01. Four-Part Harmony & Musical Cadences',
    level: 'JSS3',
    term: 1,
    recommendedWeek: 3,
    summary: 'The principles of harmonic punctuation: Perfect Cadence (V-I), Plagal Cadence (IV-I), Imperfect Cadence (I/II/IV - V), Interrupted Cadence (V-VI), and SATB voice leading rules.',
    keyFormulas: [
      'Perfect Cadence: V -> I (Complete full stop)',
      'Plagal Cadence: IV -> I (Amen close)',
      'Imperfect Cadence: I -> V or IV -> V or II -> V (Comma / unfinished question)',
      'Interrupted Cadence: V -> VI (Surprise / deceptive resolution)'
    ],
    workedExamples: [
      {
        problem: 'In the key of C Major, state the exact chord notes for a Perfect Cadence.',
        solution: 'Chord V (Dominant) = G - B - D, moving to Chord I (Tonic) = C - E - G.'
      }
    ],
    teacherGuide: 'Play each cadence type on a keyboard and ask students to identify whether the phrase feels finished, expectant, or surprised.',
    practiceQuestions: [
      {
        question: 'Which cadence functions as a musical "comma", leaving the listener expecting another phrase?',
        answer: 'Imperfect Cadence (ending on Chord V).'
      }
    ]
  },
  {
    id: 'cca-jss3-02',
    file: 'CCA_Music_JSS/JSS3/02_Transposition_and_Modulation.txt',
    title: '02. Transposition Principles & Key Modulation',
    level: 'JSS3',
    term: 1,
    recommendedWeek: 6,
    summary: 'Techniques for shifting melodies across pitch registers without altering interval structure (transposition) and seamless tonal shifting within musical compositions (modulation).',
    keyFormulas: [
      'Transposition by Interval: Shifting every note up or down by the exact same interval',
      'Modulation: Shifting tonality (e.g., from Tonic to Dominant key) using pivot chords'
    ],
    workedExamples: [
      {
        problem: 'Transpose the melodic motif C - E - G - A up a Major 2nd.',
        solution: 'C + M2 = D; E + M2 = F#; G + M2 = A; A + M2 = B. Transposed motif: D - F# - A - B (Key of D Major).'
      }
    ],
    teacherGuide: 'Guide students through transposing simple national anthem phrases from C Major to G Major.',
    practiceQuestions: [
      {
        question: 'What is the primary practical purpose of transposing a vocal song?',
        answer: 'To adjust the pitch range of the song to suit the natural comfortable vocal range (tessitura) of a specific singer or choir.'
      }
    ]
  },
  {
    id: 'cca-jss3-03',
    file: 'CCA_Music_JSS/JSS3/03_African_Musical_Forms.txt',
    title: '03. African Musical Forms, Ostinato & Polyrhythm',
    level: 'JSS3',
    term: 2,
    recommendedWeek: 2,
    summary: 'Structural elements of African indigenous music: Call-and-response, persistent ostinato basslines, polyrhythms (e.g., 3 against 2), syncopation, and pentatonic pitch organizations.',
    keyFormulas: [
      'Call-and-Response: Solo lead caller followed by chorus response',
      'Ostinato: Continuously repeated rhythmic or melodic motif',
      'Polyrhythm: Simultaneous cross-layering of contrasting metric pulses (e.g., triplet over duple)',
      'Pentatonic Scale: 5-note scale without semitones (d - r - m - s - l)'
    ],
    workedExamples: [
      {
        problem: 'Describe how call-and-response fosters communal participation in traditional African social gatherings.',
        solution: 'The soloist provides dynamic variations and storytelling in the "call", while the entire audience/community participates collectively in the predictable, unifying "response", breaking barriers between audience and performers.'
      }
    ],
    teacherGuide: 'Have half the class tap a 3-beat rhythm with their right hands while the other half taps a 2-beat rhythm with their left hands.',
    practiceQuestions: [
      {
        question: 'What is the term for a short melodic or rhythmic phrase repeated persistently throughout a piece of music?',
        answer: 'Ostinato.'
      }
    ]
  },
  {
    id: 'cca-jss3-04',
    file: 'CCA_Music_JSS/JSS3/04_Nigerian_Art_Music_Composers.txt',
    title: '04. Pioneers of Nigerian & African Art Music',
    level: 'JSS3',
    term: 2,
    recommendedWeek: 5,
    summary: 'Biographies, landmark compositions, and cultural contributions of legendary Nigerian art musicians: Fela Sowande, T.K.E. Phillips, Dayo Dedeke, and Prof. Laz Ekwueme.',
    keyFormulas: [
      'Fela Sowande: Father of Nigerian Art Music ("African Suite for Strings", organ masterworks)',
      'T.K.E. Phillips: Father of Nigerian Church Music (Cathedral Church of Christ Lagos organist)',
      'Dayo Dedeke: Yoruba school songs & choral compositions ("Ma Gbagbe Ile")',
      'Prof. Laz Ekwueme: Pioneer choral conductor & musicologist (Laz Ekwueme National Chorale)'
    ],
    workedExamples: [
      {
        problem: 'What was Fela Sowande’s significant contribution to international music literature?',
        solution: 'He successfully integrated indigenous Nigerian folk melodies and rhythms into large-scale Western classical symphonic and organ forms, presenting African art music on major international concert stages.'
      }
    ],
    teacherGuide: 'Present biographical profiles and play excerpts of Fela Sowande’s African Suite ("Joyful Day" movement).',
    practiceQuestions: [
      {
        question: 'Who is recognized as the "Father of Nigerian Art Music"?',
        answer: 'Fela Sowande.'
      }
    ]
  },
  {
    id: 'cca-jss3-05',
    file: 'CCA_Music_JSS/JSS3/05_Music_Technology_and_DAWs.txt',
    title: '05. Music Technology, Digital Audio & Acoustics',
    level: 'JSS3',
    term: 3,
    recommendedWeek: 2,
    summary: 'Acoustics principles (frequency in Hz, amplitude in dB), audio transducers (microphones, loudspeakers), MIDI protocol, Audio Interfaces (ADC/DAC), and Digital Audio Workstations (DAWs).',
    keyFormulas: [
      'Frequency = Hertz (Hz) = Pitch | Amplitude = Decibels (dB) = Loudness',
      'Microphone = Converts acoustic sound waves into electrical audio signals (Transducer)',
      'MIDI = Musical Instrument Digital Interface (Sends note data/velocity, not sound waves)',
      'DAW = Digital Audio Workstation software (FL Studio, Logic Pro, Pro Tools, Cubase)'
    ],
    workedExamples: [
      {
        problem: 'Explain the difference between a MIDI recording and an Audio recording in a modern music studio.',
        solution: 'An Audio recording captures actual sound pressure waves as digital audio waveforms (e.g., a singer’s voice into a microphone). A MIDI recording captures instructions (which note was struck, how hard, and for how long), allowing the producer to change instrument sounds or fix note pitches anytime without re-recording.'
      }
    ],
    teacherGuide: 'Demonstrate a virtual DAW interface on screen showing audio waveforms, MIDI piano roll editor, and track mixer faders.',
    practiceQuestions: [
      {
        question: 'What does the acronym MIDI stand for in music technology?',
        answer: 'Musical Instrument Digital Interface.'
      }
    ]
  },
  {
    id: 'cca-jss3-06',
    file: 'CCA_Music_JSS/JSS3/06_Careers_in_Music_and_Copyright.txt',
    title: '06. Careers in Music & Intellectual Property (Copyright)',
    level: 'JSS3',
    term: 3,
    recommendedWeek: 4,
    summary: 'Career pathways in the modern creative economy (Producer, Sound Engineer, Ethnomusicologist, Jingle Composer), copyright laws, performing rights organizations (COSON, MCSN), and royalty collection.',
    keyFormulas: [
      'Copyright = Exclusive legal rights granted to music creators to reproduce and broadcast their work',
      'Royalties = Financial remuneration collected when copyrighted music is played or streamed',
      'COSON = Copyright Society of Nigeria | MCSN = Musical Copyright Society Nigeria'
    ],
    workedExamples: [
      {
        problem: 'What legal step must a filmmaker take before using a popular artist’s recorded song in their movie?',
        solution: 'The filmmaker must obtain a synchronization (sync) and master use license from the copyright owners and pay the negotiated licensing fees/royalties.'
      }
    ],
    teacherGuide: 'Discuss the negative economic impact of digital piracy on local artists and how streaming platforms calculate royalties.',
    practiceQuestions: [
      {
        question: 'What is the primary function of a collective management organization like COSON in Nigeria?',
        answer: 'To license copyrighted musical works, monitor commercial public broadcasts, and collect and distribute royalty payments to composers and performers.'
      }
    ]
  }
];

// ==================== PRE-BUILT 10-QUESTION CBT EXAMS FOR CCA MUSIC ====================

export const CCA_MUSIC_CBT_EXAMS: CBTExamConfig[] = [
  {
    id: 'cca-music-jss1-comprehensive',
    title: 'JSS 1 CCA Music Comprehensive CBT Assessment',
    code: 'CCA-MUS-JSS1',
    level: 'JSS1',
    subject: 'Cultural & Creative Arts (Music)',
    category: 'Cultural & Creative Arts (CCA Music)',
    term: 1,
    durationMinutes: 15,
    totalQuestions: 10,
    passingPercentage: 60,
    allowCalculator: false,
    enableAntiCheatProctoring: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    instructions: [
      'Read each music theory question carefully before choosing an option.',
      'Check stave note names, note values, and instrument classifications.',
      'Flag questions for review to double-check before submission.'
    ],
    revisedNotesBrief: 'Review properties of sound (Pitch, Dynamics, Timbre), Treble lines (EGBDF) and spaces (FACE), Note values (Semibreve=4, Minim=2, Crotchet=1, Quaver=0.5), and African instrument families (Idiophones, Membranophones, Aerophones, Chordophones).',
    questions: [
      {
        id: 'cca-jss1-q1',
        subjectId: 'cca_music',
        topic: 'Properties of Musical Sound',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Which property of musical sound distinguishes a flute from a trumpet when both are playing the exact same pitch at the same loudness?',
        options: ['Timbre (Tone Colour)', 'Pitch', 'Duration', 'Tempo'],
        correctIndex: 0,
        explanation: 'Timbre (tone colour) is the unique acoustic characteristic of a voice or instrument determined by its harmonic overtones.',
        syllabusReference: 'JSS1 CCA Music: Module 1.2 Sound Properties'
      },
      {
        id: 'cca-jss1-q2',
        subjectId: 'cca_music',
        topic: 'The Musical Stave & Clefs',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What are the letter names of the four spaces of the Treble Stave counted from bottom to top?',
        options: ['F - A - C - E', 'E - G - B - D', 'A - C - E - G', 'G - B - D - F'],
        correctIndex: 0,
        explanation: 'The spaces of the Treble Stave spell the word "FACE" from space 1 to space 4.',
        syllabusReference: 'JSS1 CCA Music: Module 2.2 Treble Clef Spaces'
      },
      {
        id: 'cca-jss1-q3',
        subjectId: 'cca_music',
        topic: 'Musical Note Values',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'How many Crotchet (quarter note) beats are mathematically equivalent to one Semibreve (whole note)?',
        options: ['4 Crotchets', '2 Crotchets', '8 Crotchets', '6 Crotchets'],
        correctIndex: 0,
        explanation: '1 Semibreve = 4 beats. Since 1 Crotchet = 1 beat, 1 Semibreve = 4 Crotchets.',
        syllabusReference: 'JSS1 CCA Music: Module 3.1 Note Hierarchy'
      },
      {
        id: 'cca-jss1-q4',
        subjectId: 'cca_music',
        topic: 'Rhythmic Rests',
        difficulty: 'Medium',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'Where does the standard Minim Rest sit on the 5-line musical stave?',
        options: [
          'Resting on top of the 3rd line',
          'Hanging below the 4th line',
          'Resting in the 1st space',
          'Hanging below the 2nd line'
        ],
        correctIndex: 0,
        explanation: 'A minim rest sits upright on top of the 3rd line of the stave, whereas a semibreve rest hangs below the 4th line.',
        syllabusReference: 'JSS1 CCA Music: Module 3.2 Rests'
      },
      {
        id: 'cca-jss1-q5',
        subjectId: 'cca_music',
        topic: 'Time Signatures',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What does the top number in a 3/4 time signature indicate?',
        options: [
          'There are 3 beats in each bar',
          'Each beat is worth 3 seconds',
          'There are 3 lines on the stave',
          'The piece has 3 musical clefs'
        ],
        correctIndex: 0,
        explanation: 'In any time signature, the top number specifies the exact number of beats contained within each bar / measure.',
        syllabusReference: 'JSS1 CCA Music: Module 4.1 Time Signatures'
      },
      {
        id: 'cca-jss1-q6',
        subjectId: 'cca_music',
        topic: 'Singing Voice Classification',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Which human voice category represents the highest female singing voice range?',
        options: ['Soprano', 'Alto', 'Tenor', 'Bass'],
        correctIndex: 0,
        explanation: 'Soprano is the highest female vocal range; Alto is the lowest female vocal range.',
        syllabusReference: 'JSS1 CCA Music: Module 5.2 Voice Classification'
      },
      {
        id: 'cca-jss1-q7',
        subjectId: 'cca_music',
        topic: 'African Organology',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'The Yoruba Sekere and Agogo (metal bell) both belong to which acoustic instrument family?',
        options: ['Idiophones', 'Membranophones', 'Aerophones', 'Chordophones'],
        correctIndex: 0,
        explanation: 'Idiophones produce sound from the natural resonance of their own solid material when shaken, struck, or scraped without needing strings or skin membranes.',
        syllabusReference: 'JSS1 CCA Music: Module 6.1 Idiophones'
      },
      {
        id: 'cca-jss1-q8',
        subjectId: 'cca_music',
        topic: 'African Wind Instruments',
        difficulty: 'Medium',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'The Kakaki is a long ceremonial trumpet traditionally played in Northern Nigeria for royal Emirs. Which organological class does it represent?',
        options: ['Aerophones', 'Chordophones', 'Membranophones', 'Idiophones'],
        correctIndex: 0,
        explanation: 'The Kakaki is a blown wind instrument (Aerophone), utilizing vibrating columns of air inside its elongated brass tube.',
        syllabusReference: 'JSS1 CCA Music: Module 6.3 Aerophones'
      },
      {
        id: 'cca-jss1-q9',
        subjectId: 'cca_music',
        topic: 'Tonic Solfa Syllables',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'In standard diatonic Tonic Solfa, what syllable immediately follows "fah"?',
        options: ['soh', 'me', 'lah', 'ray'],
        correctIndex: 0,
        explanation: 'The complete diatonic sequence is: doh, ray, me, fah, soh, lah, te, doh\'. After "fah" comes "soh".',
        syllabusReference: 'JSS1 CCA Music: Module 5.1 Tonic Solfa'
      },
      {
        id: 'cca-jss1-q10',
        subjectId: 'cca_music',
        topic: 'African String Instruments',
        difficulty: 'Hard',
        taxonomy: 'Analysis',
        marks: 1,
        questionText: 'The Hausa "Goge" is a one-string bowed fiddle with a horsehair string and calabash resonator. It is classified as a:',
        options: ['Chordophone', 'Membranophone', 'Idiophone', 'Aerophone'],
        correctIndex: 0,
        explanation: 'Chordophones produce sound through the vibration of one or more stretched strings.',
        syllabusReference: 'JSS1 CCA Music: Module 6.4 Chordophones'
      }
    ]
  },
  {
    id: 'cca-music-jss2-comprehensive',
    title: 'JSS 2 CCA Music Intermediate CBT Assessment',
    code: 'CCA-MUS-JSS2',
    level: 'JSS2',
    subject: 'Cultural & Creative Arts (Music)',
    category: 'Cultural & Creative Arts (CCA Music)',
    term: 1,
    durationMinutes: 20,
    totalQuestions: 10,
    passingPercentage: 60,
    allowCalculator: false,
    enableAntiCheatProctoring: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    instructions: [
      'Answer all 10 questions covering major scales, orchestral instruments, eras, and Nigerian genres.',
      'Pay close attention to key signatures and dynamic markings.'
    ],
    revisedNotesBrief: 'Review Major scale formula (T-T-S-T-T-T-S), Key signatures (G Major = 1#, D Major = 2#, F Major = 1b), Orchestra families (Strings, Woodwinds, Brass, Percussion), Western eras (Baroque, Classical, Romantic), and Nigerian popular genres (Highlife, Juju, Afrobeat, Fuji).',
    questions: [
      {
        id: 'cca-jss2-q1',
        subjectId: 'cca_music',
        topic: 'Major Scale Construction',
        difficulty: 'Medium',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'In any standard Major Scale, between which scale degrees do the natural semitones occur?',
        options: [
          'Between 3rd-4th and 7th-8th degrees',
          'Between 1st-2nd and 5th-6th degrees',
          'Between 2nd-3rd and 6th-7th degrees',
          'Between 4th-5th and 7th-8th degrees'
        ],
        correctIndex: 0,
        explanation: 'The Major Scale formula is Tone-Tone-Semitone-Tone-Tone-Tone-Semitone. Semitones fall precisely between degrees 3-4 and 7-8.',
        syllabusReference: 'JSS2 CCA Music: Module 1.2 Scale Formula'
      },
      {
        id: 'cca-jss2-q2',
        subjectId: 'cca_music',
        topic: 'Key Signatures',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What is the key signature of G Major?',
        options: ['One sharp (F#)', 'Two sharps (F#, C#)', 'One flat (Bb)', 'Zero sharps and zero flats'],
        correctIndex: 0,
        explanation: 'G Major has one sharp on the note F (F#).',
        syllabusReference: 'JSS2 CCA Music: Module 1.3 Key Signatures'
      },
      {
        id: 'cca-jss2-q3',
        subjectId: 'cca_music',
        topic: 'Musical Intervals',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'What is the interval distance between Middle C and the note G above it?',
        options: ['A Perfect 5th', 'A Major 3rd', 'A Perfect 4th', 'A Major 6th'],
        correctIndex: 0,
        explanation: 'Counting C (1), D (2), E (3), F (4), G (5) gives a span of 5 notes, forming a Perfect 5th.',
        syllabusReference: 'JSS2 CCA Music: Module 2.1 Intervals'
      },
      {
        id: 'cca-jss2-q4',
        subjectId: 'cca_music',
        topic: 'Western Orchestra Woodwinds',
        difficulty: 'Medium',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Which of the following orchestral woodwind instruments produces sound through a double reed?',
        options: ['Oboe', 'Flute', 'Clarinet', 'Trumpet'],
        correctIndex: 0,
        explanation: 'The Oboe and Bassoon use double reeds; Flute uses no reed; Clarinet uses a single reed.',
        syllabusReference: 'JSS2 CCA Music: Module 3.2 Woodwinds'
      },
      {
        id: 'cca-jss2-q5',
        subjectId: 'cca_music',
        topic: 'Western Music Eras',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Johann Sebastian Bach and George Frideric Handel were master composers of which historic musical period?',
        options: ['Baroque Era (1600 – 1750)', 'Classical Era (1750 – 1820)', 'Romantic Era (1820 – 1900)', 'Renaissance Era'],
        correctIndex: 0,
        explanation: 'Bach and Handel were the monumental giants of the Baroque period, characterized by polyphonic counterpoint and basso continuo.',
        syllabusReference: 'JSS2 CCA Music: Module 4.1 Baroque'
      },
      {
        id: 'cca-jss2-q6',
        subjectId: 'cca_music',
        topic: 'Nigerian Popular Genres',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Who is the pioneer and visionary creator of the Afrobeat music genre?',
        options: ['Fela Anikulapo Kuti', 'King Sunny Ade', 'Haruna Ishola', 'Sikiru Ayinde Barrister'],
        correctIndex: 0,
        explanation: 'Fela Anikulapo Kuti created Afrobeat by fusing jazz, funk, highlife, and African polyrhythms with sociopolitical lyrics.',
        syllabusReference: 'JSS2 CCA Music: Module 5.3 Afrobeat'
      },
      {
        id: 'cca-jss2-q7',
        subjectId: 'cca_music',
        topic: 'Musical Dynamics',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What does the Italian dynamic term "Forte" (f) instruct a musician to do?',
        options: ['Play loudly', 'Play very softly', 'Gradually speed up', 'Play at a walking pace'],
        correctIndex: 0,
        explanation: 'Forte (f) means loud; Piano (p) means soft.',
        syllabusReference: 'JSS2 CCA Music: Module 6.1 Dynamics'
      },
      {
        id: 'cca-jss2-q8',
        subjectId: 'cca_music',
        topic: 'Dynamic Gradation',
        difficulty: 'Medium',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'What does a "Crescendo" (<) marking indicate in sheet music?',
        options: ['Gradually getting louder', 'Gradually getting softer', 'Suddenly stopping', 'Playing in slow tempo'],
        correctIndex: 0,
        explanation: 'Crescendo (<) means gradually increasing the volume/loudness.',
        syllabusReference: 'JSS2 CCA Music: Module 6.1 Crescendo'
      },
      {
        id: 'cca-jss2-q9',
        subjectId: 'cca_music',
        topic: 'Nigerian Traditional Genres',
        difficulty: 'Medium',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Fuji music originally evolved from which traditional Islamic morning wake-up song practice?',
        options: ['Were / Ajisari', 'Sakara', 'Apala', 'Dadakuada'],
        correctIndex: 0,
        explanation: 'Fuji music was pioneered by Sikiru Ayinde Barrister from the traditional Islamic Ramadan dawn wake-up music called Were/Ajisari.',
        syllabusReference: 'JSS2 CCA Music: Module 5.4 Fuji Music'
      },
      {
        id: 'cca-jss2-q10',
        subjectId: 'cca_music',
        topic: 'Western String Instruments',
        difficulty: 'Hard',
        taxonomy: 'Analysis',
        marks: 1,
        questionText: 'Which orchestral bowed string instrument produces the deepest and lowest pitch range?',
        options: ['Double Bass (Contrabass)', 'Violoncello (Cello)', 'Viola', 'Violin'],
        correctIndex: 0,
        explanation: 'The Double Bass is the largest instrument in the string section and produces the lowest fundamental frequencies.',
        syllabusReference: 'JSS2 CCA Music: Module 3.1 Strings'
      }
    ]
  },
  {
    id: 'cca-music-jss3-comprehensive',
    title: 'JSS 3 CCA Music Advanced BECE CBT Assessment',
    code: 'CCA-MUS-JSS3',
    level: 'JSS3',
    subject: 'Cultural & Creative Arts (Music)',
    category: 'Cultural & Creative Arts (CCA Music)',
    term: 1,
    durationMinutes: 20,
    totalQuestions: 10,
    passingPercentage: 60,
    allowCalculator: false,
    enableAntiCheatProctoring: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    instructions: [
      'Comprehensive final BECE preparation exam for JSS 3 CCA Music.',
      'Topics include SATB harmony, cadences, African structures, Nigerian composers, and music tech.'
    ],
    revisedNotesBrief: 'Review Cadences (Perfect V-I, Plagal IV-I, Imperfect I/IV/II-V, Interrupted V-VI), African forms (Call-and-response, Ostinato, Polyrhythm), Nigerian art music pioneers (Fela Sowande, T.K.E. Phillips, Laz Ekwueme), DAW tech (MIDI vs Audio), and Copyright/COSON rules.',
    questions: [
      {
        id: 'cca-jss3-q1',
        subjectId: 'cca_music',
        topic: 'Musical Cadences',
        difficulty: 'Medium',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Which musical cadence moves from Chord V (Dominant) to Chord I (Tonic), creating a complete sense of finality?',
        options: ['Perfect Cadence', 'Imperfect Cadence', 'Plagal Cadence', 'Interrupted Cadence'],
        correctIndex: 0,
        explanation: 'A Perfect Cadence (V - I) acts like a grammatical full stop, sounding completely resolved.',
        syllabusReference: 'JSS3 CCA Music: Module 1.2 Perfect Cadence'
      },
      {
        id: 'cca-jss3-q2',
        subjectId: 'cca_music',
        topic: 'The Plagal Cadence',
        difficulty: 'Medium',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'What chord progression defines the Plagal Cadence commonly sung for "Amen"?',
        options: ['Chord IV to Chord I (Subdominant to Tonic)', 'Chord V to Chord I', 'Chord I to Chord V', 'Chord V to Chord VI'],
        correctIndex: 0,
        explanation: 'The Plagal Cadence moves from Chord IV (Subdominant) to Chord I (Tonic).',
        syllabusReference: 'JSS3 CCA Music: Module 1.2 Plagal Cadence'
      },
      {
        id: 'cca-jss3-q3',
        subjectId: 'cca_music',
        topic: 'The Interrupted Cadence',
        difficulty: 'Hard',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'When a musical phrase moves from Chord V to Chord VI instead of resolving to Tonic Chord I, what cadence is formed?',
        options: ['Interrupted (Deceptive) Cadence', 'Perfect Cadence', 'Plagal Cadence', 'Imperfect Cadence'],
        correctIndex: 0,
        explanation: 'The Interrupted or Deceptive cadence surprises the listener by moving from Chord V to Chord VI.',
        syllabusReference: 'JSS3 CCA Music: Module 1.2 Interrupted Cadence'
      },
      {
        id: 'cca-jss3-q4',
        subjectId: 'cca_music',
        topic: 'African Musical Forms',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What is the term for a short melodic or rhythmic motif that is repeated persistently throughout a musical performance?',
        options: ['Ostinato', 'Cadence', 'Transposition', 'Modulation'],
        correctIndex: 0,
        explanation: 'An Ostinato is a persistently repeating musical phrase or rhythmic pattern.',
        syllabusReference: 'JSS3 CCA Music: Module 3.1 Ostinato'
      },
      {
        id: 'cca-jss3-q5',
        subjectId: 'cca_music',
        topic: 'African Polyrhythms',
        difficulty: 'Medium',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'What term describes the simultaneous layering of two or more independent, contrasting rhythmic meters in African music?',
        options: ['Polyrhythm (Cross-rhythm)', 'Monophony', 'Unison', 'Transposition'],
        correctIndex: 0,
        explanation: 'Polyrhythm is the simultaneous use of two or more conflicting rhythmic pulses (e.g., 3 over 2).',
        syllabusReference: 'JSS3 CCA Music: Module 3.1 Polyrhythm'
      },
      {
        id: 'cca-jss3-q6',
        subjectId: 'cca_music',
        topic: 'Nigerian Art Music Pioneers',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Which distinguished Nigerian composer and organist is universally celebrated as the "Father of Modern Nigerian Art Music"?',
        options: ['Fela Sowande', 'T.K.E. Phillips', 'Dayo Dedeke', 'Prof. Laz Ekwueme'],
        correctIndex: 0,
        explanation: 'Fela Sowande composed landmark works such as the "African Suite for String Orchestra" and is recognized as the Father of Nigerian Art Music.',
        syllabusReference: 'JSS3 CCA Music: Module 4.1 Fela Sowande'
      },
      {
        id: 'cca-jss3-q7',
        subjectId: 'cca_music',
        topic: 'Nigerian Church Music Pioneers',
        difficulty: 'Medium',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Who served as the organist of Cathedral Church of Christ, Lagos, and is celebrated as the "Father of Nigerian Church Music"?',
        options: ['Thomas King Ekundayo (T.K.E.) Phillips', 'Fela Sowande', 'Dayo Dedeke', 'Fela Kuti'],
        correctIndex: 0,
        explanation: 'T.K.E. Phillips was the long-serving organist and choirmaster at the Cathedral Church of Christ, Lagos, and published foundational treatises on Yoruba choral music.',
        syllabusReference: 'JSS3 CCA Music: Module 4.2 T.K.E. Phillips'
      },
      {
        id: 'cca-jss3-q8',
        subjectId: 'cca_music',
        topic: 'Music Technology & MIDI',
        difficulty: 'Medium',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'What is the primary function of MIDI (Musical Instrument Digital Interface) in modern music production?',
        options: [
          'It transmits performance data (note pitch, velocity, duration) between digital instruments and computers',
          'It records live acoustic voice waves directly into MP3 format',
          'It acts as an analog microphone for singing',
          'It amplifies electrical audio signals to loudspeakers'
        ],
        correctIndex: 0,
        explanation: 'MIDI transmits numerical control commands and performance instructions, not raw audio waveforms.',
        syllabusReference: 'JSS3 CCA Music: Module 5.2 MIDI'
      },
      {
        id: 'cca-jss3-q9',
        subjectId: 'cca_music',
        topic: 'Digital Audio Workstations (DAWs)',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'FL Studio, Logic Pro, Pro Tools, and Cubase are examples of:',
        options: [
          'Digital Audio Workstations (DAWs)',
          'Analog Audio Transducers',
          'Mechanical Acoustic Instruments',
          'Copyright Collecting Agencies'
        ],
        correctIndex: 0,
        explanation: 'DAWs are software applications designed for recording, editing, sequencing, arranging, and mixing digital music.',
        syllabusReference: 'JSS3 CCA Music: Module 5.2 DAWs'
      },
      {
        id: 'cca-jss3-q10',
        subjectId: 'cca_music',
        topic: 'Copyright & Royalties',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'What is the primary role of collective management organizations like COSON and MCSN in Nigeria?',
        options: [
          'To license musical works, monitor broadcasts, and collect/distribute royalties to composers',
          'To manufacture guitars and pianos for secondary schools',
          'To broadcast television soap operas',
          'To manufacture physical vinyl records'
        ],
        correctIndex: 0,
        explanation: 'COSON (Copyright Society of Nigeria) and MCSN protect intellectual property rights and collect royalties for artists from public broadcasts.',
        syllabusReference: 'JSS3 CCA Music: Module 6.2 Copyright'
      }
    ]
  }
];
