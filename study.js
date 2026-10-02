const boringWords = ['that', 'this', 'with', 'from', 'were', 'they', 'their', 'have', 'into', 'which', 'about', 'there', 'what', 'when', 'your', 'them', 'been', 'than', 'also', 'some', 'more', 'most', 'only']

function getSentences(notes) {
  return notes
    .split(/\n|\. /)
    .map((sentence) => sentence.replace(/^- /, '').trim())
    .filter((sentence) => sentence !== '')
}

function getWords(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((word) => word.length > 3 && !boringWords.includes(word))
}

function countWords(notes) {
  const counts = {}
  for (const word of getWords(notes)) {
    counts[word] = (counts[word] || 0) + 1
  }
  return counts
}

function scoreSentence(sentence, counts) {
  let score = 0
  for (const word of getWords(sentence)) {
    score += counts[word]
  }
  return score
}

function rankSentences(notes) {
  const counts = countWords(notes)
  return getSentences(notes).sort((first, second) => scoreSentence(second, counts) - scoreSentence(first, counts))
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1)
}

function cramSummary(notes) {
  const sentences = getSentences(notes)
  const topHalf = rankSentences(notes).slice(0, Math.ceil(sentences.length / 2))
  const keptInOrder = sentences.filter((sentence) => topHalf.includes(sentence))
  return '- ' + keptInOrder.join('\n- ')
}

function keyIdea(notes) {
  const counts = countWords(notes)
  const topWords = Object.keys(counts)
    .sort((first, second) => counts[second] - counts[first])
    .slice(0, 5)
    .map(capitalize)
  const bestSentences = rankSentences(notes).slice(0, 3)
  return 'MAIN TOPIC: ' + topWords[0] + '\n\nKEY WORDS: ' + topWords.join(', ') + '\n\nMOST IMPORTANT POINTS:\n- ' + bestSentences.join('\n- ')
}

function shuffle(list) {
  return list.sort(() => Math.random() - 0.5)
}

function getDefinitions(notes) {
  return getSentences(notes)
    .filter((sentence) => sentence.includes(': '))
    .map((sentence) => ({ term: sentence.split(': ')[0], meaning: sentence.split(': ')[1] }))
}

function makeQuiz(notes) {
  const definitions = getDefinitions(notes)
  const meanings = definitions.map((definition) => definition.meaning)

  return shuffle(definitions)
    .slice(0, 5)
    .map((definition) => {
      const wrongMeanings = shuffle(meanings.filter((meaning) => meaning !== definition.meaning)).slice(0, 3)
      return {
        question: 'What is ' + definition.term + '?',
        choices: shuffle([definition.meaning, ...wrongMeanings]),
        answer: definition.meaning,
      }
    })
}
