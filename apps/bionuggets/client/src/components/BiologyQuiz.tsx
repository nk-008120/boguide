import { useState } from 'react'

interface Question {
  question: string
  options: string[]
  correct: number
  explanation: string
}

const questions: Question[] = [
  {
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
    correct: 1,
    explanation: 'Mitochondria is responsible for producing energy (ATP) for the cell.'
  },
  {
    question: 'Which organelle is responsible for protein synthesis?',
    options: ['Mitochondria', 'Lysosome', 'Ribosome', 'Chloroplast'],
    correct: 2,
    explanation: 'Ribosomes read mRNA and synthesize proteins based on the genetic code.'
  },
  {
    question: 'What is the basic unit of life?',
    options: ['Atom', 'Molecule', 'Cell', 'Tissue'],
    correct: 2,
    explanation: 'The cell is the smallest unit of life and all living organisms are made of cells.'
  },
  {
    question: 'Which process converts glucose into energy?',
    options: ['Photosynthesis', 'Cellular Respiration', 'Fermentation', 'Transpiration'],
    correct: 1,
    explanation: 'Cellular respiration breaks down glucose to produce ATP energy.'
  },
  {
    question: 'What do chloroplasts contain?',
    options: ['Hemoglobin', 'Chlorophyll', 'Myelin', 'Keratin'],
    correct: 1,
    explanation: 'Chlorophyll is the pigment that captures light energy for photosynthesis.'
  }
]

export default function BiologyQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizComplete, setQuizComplete] = useState(false)

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    setShowExplanation(true)

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizComplete(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowExplanation(false)
    setSelectedAnswer(null)
    setQuizComplete(false)
  }

  if (quizComplete) {
    return (
      <div className="quiz-container">
        <div className="quiz-complete">
          <h3>🎉 Quiz Complete!</h3>
          <div className="quiz-score">
            <p className="score-text">
              You scored <span className="score-number">{score}</span> out of <span className="score-number">{questions.length}</span>
            </p>
            <p className="score-percentage">{Math.round((score / questions.length) * 100)}%</p>
          </div>
          <button onClick={resetQuiz} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const isAnswered = selectedAnswer !== null

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>🧬 Biology Quiz</h3>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="quiz-content">
        <p className="quiz-question">{question.question}</p>

        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
              className={`quiz-option ${
                isAnswered
                  ? index === question.correct
                    ? 'correct'
                    : index === selectedAnswer
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
            >
              {option}
              {isAnswered && index === question.correct && ' ✓'}
              {isAnswered && index === selectedAnswer && index !== question.correct && ' ✗'}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className={`quiz-explanation ${selectedAnswer === question.correct ? 'correct' : 'incorrect'}`}>
            <p>
              <strong>{selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect'}</strong>
            </p>
            <p>{question.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <button onClick={handleNext} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
