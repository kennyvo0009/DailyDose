const notesBox = document.getElementById('notes')
const output = document.getElementById('output')
const cramButton = document.getElementById('cram')
const ideaButton = document.getElementById('idea')
const quizButton = document.getElementById('quiz')
const fileInput = document.getElementById('file')

let quiz = []

function showCramSummary() {
  const notes = notesBox.value
  const summary = cramSummary(notes)
  output.innerText = summary
}

function showKeyIdea() {
  const notes = notesBox.value
  const idea = keyIdea(notes)
  output.innerText = idea
}

function showQuiz() {
  const notes = notesBox.value
  quiz = makeQuiz(notes)

  if (quiz.length === 0) {
    output.innerText = 'Add some lines like "Term: meaning" to get a quiz.'
    return
  }

  let html = ''

  for (let questionNumber = 0; questionNumber < quiz.length; questionNumber++) {
    const question = quiz[questionNumber]
    html = html + '<p>' + (questionNumber + 1) + '. ' + question.question + '</p>'

    for (let choiceNumber = 0; choiceNumber < question.choices.length; choiceNumber++) {
      const choice = question.choices[choiceNumber]
      html = html + '<label>'
      html = html + '<input type="radio" name="question' + questionNumber + '" value="' + choiceNumber + '"> '
      html = html + choice
      html = html + '</label>'
    }
  }

  html = html + '<br><button id="check">Check answers</button>'
  html = html + '<p id="score"></p>'

  output.innerHTML = html

  const checkButton = document.getElementById('check')
  checkButton.onclick = checkAnswers
}

function checkAnswers() {
  let score = 0

  for (let questionNumber = 0; questionNumber < quiz.length; questionNumber++) {
    const question = quiz[questionNumber]
    const pickedChoice = document.querySelector('input[name="question' + questionNumber + '"]:checked')

    if (pickedChoice === null) {
      continue
    }

    const pickedAnswer = question.choices[pickedChoice.value]

    if (pickedAnswer === question.answer) {
      score = score + 1
    }
  }

  const scoreText = document.getElementById('score')
  scoreText.innerText = 'Score: ' + score + ' out of ' + quiz.length
}

async function loadFile() {
  const file = fileInput.files[0]
  const text = await file.text()
  notesBox.value = text
}

cramButton.onclick = showCramSummary
ideaButton.onclick = showKeyIdea
quizButton.onclick = showQuiz
fileInput.onchange = loadFile
