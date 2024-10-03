import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import MarkdownWithLinks from './MarkdownWithLinks'

const POINTS_PER_QUESTION = 10

const Score = ({ points, numQuestions }: { points: number; numQuestions: number }) => {
  return (
    <div className='flex'>
      {points} / {POINTS_PER_QUESTION * numQuestions}
    </div>
  )
}

interface SimpleQuestionAnswerData {
  question: string
  options: string[]
  correctAnswer: number
  concept: string
  conceptShortDefinition: string
  explanation: string
}

const SimpleQuestionAnswerView = ({ dataUrl }: { dataUrl: string }) => {
  const [simpleQuestions, setSimpleQuestions] = useState<SimpleQuestionAnswerData[]>([])

  // Create an array of refs to store references to each card
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const [totalPoints, setTotalPoints] = useState(0)
  const [shouldToggleMap, setShouldToggleMap] = useState<{
    [key: number]: boolean
  }>({})

  const toggleValueForIndex = (key: number) => {
    setShouldToggleMap((prevDict) => ({
      ...prevDict, // Copy the existing dictionary
      [key]: !prevDict[key], // Toggle the value of the specific key
    }))
  }

  useEffect(() => {
    const fetchGistData = async () => {
      const cacheBustedUrl = `${dataUrl}?t=${new Date().getTime()}`
      const response = await fetch(cacheBustedUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setSimpleQuestions(result.data)
    }

    fetchGistData()
  }, [dataUrl])

  const addPointsSound = new Audio('/ayan-schooling/sounds/mixkit-achievement-bell-600.wav')
  const moveToNextSound = new Audio(
    '/ayan-schooling/sounds/mixkit-fast-transitions-swoosh-3115.wav',
  )
  const undoAddPointsSound = new Audio('/ayan-schooling/sounds/mixkit-money-bag-drop-1989.wav')

  const [answers, setAnswers] = useState(Array(simpleQuestions.length).fill(null))
  const [showExplanations, setShowExplanations] = useState(
    Array(simpleQuestions.length).fill(false),
  )

  const handleAnswerChange = (questionIndex: number, answerIndex: string) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = +answerIndex
    setAnswers(newAnswers)

    const nextCardRef = cardRefs.current[questionIndex + 1] // Get reference to the next card
    if (nextCardRef) {
      nextCardRef.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling
        block: 'start', // Align the next card to the top
      })
      moveToNextSound.play()
    }
  }

  const handleSubmit = (questionIndex: number) => {
    const newShowExplanations = [...showExplanations]
    newShowExplanations[questionIndex] = true
    setShowExplanations(newShowExplanations)
  }

  return (
    <div className='mx-auto w-full max-w-4xl p-4'>
      <h1 className='mb-6 flex flex-col items-center gap-2 text-3xl font-bold'>
        {Score({ points: totalPoints, numQuestions: simpleQuestions.length })}
      </h1>
      {simpleQuestions.map((question, questionIndex) => (
        <Card
          key={questionIndex}
          ref={(el) => (cardRefs.current[questionIndex] = el)} // Store reference to the current card
          className='mb-8 bg-white/90 shadow-xl'
        >
          <CardHeader>
            <h2 className='text-xl font-semibold text-purple-700'>{`Question ${
              questionIndex + 1
            }`}</h2>
            <div className='flex flex-col gap-1'>
              <p className='text-sm text-gray-500'>Concept: {question.concept}</p>
              {question.conceptShortDefinition && (
                <p className='text-sm text-gray-500'>{question.conceptShortDefinition}</p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className='mb-4 text-lg'>{question.question}</p>
            <RadioGroup
              value={answers[questionIndex]?.toString()}
              onValueChange={(value: string) => handleAnswerChange(questionIndex, value)}
            >
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className='mb-1 flex cursor-pointer items-center space-x-2 rounded-full bg-gradient-to-r from-purple-200 px-4 hover:from-purple-300'
                >
                  <RadioGroupItem
                    value={optionIndex.toString()}
                    id={`q${questionIndex}-option-${optionIndex}`}
                    className='border-2 border-purple-500'
                  />
                  <label
                    htmlFor={`q${questionIndex}-option-${optionIndex}`}
                    className='peer-disabled:opacity-7 w-full cursor-pointer py-4 text-sm font-medium leading-none peer-disabled:cursor-not-allowed'
                  >
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
            <Button
              onClick={() => handleSubmit(questionIndex)}
              className='mt-4 rounded-full bg-purple-600 hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-700'
              disabled={answers[questionIndex]?.toString() === undefined}
            >
              Check Answer
            </Button>
            {showExplanations[questionIndex] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='mt-4'
              >
                {/* <p
                  className={`font-bold ${
                    answers[questionIndex] === question.correctAnswer
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {answers[questionIndex] === question.correctAnswer
                    ? "Correct!"
                    : "Not quite right. Try again!"}
                </p> */}
                <div className='flex flex-row justify-between'>
                  <p className='font-bold text-purple-600'>Did you get it right?</p>
                  <div className='flex items-center gap-2'>
                    Score:
                    {Score({
                      points: totalPoints,
                      numQuestions: simpleQuestions.length,
                    })}
                    {shouldToggleMap[questionIndex] === true ? (
                      <Button
                        onClick={() => {
                          toggleValueForIndex(questionIndex)
                          setTotalPoints(totalPoints - POINTS_PER_QUESTION)

                          undoAddPointsSound.play()
                        }}
                        className='ml-2 rounded-full bg-red-500 hover:bg-red-700'
                      >
                        Undo
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          toggleValueForIndex(questionIndex)
                          setTotalPoints(totalPoints + POINTS_PER_QUESTION)

                          addPointsSound.play()
                        }}
                        className='ml-2 rounded-full bg-purple-600 hover:bg-purple-700'
                      >
                        Add {POINTS_PER_QUESTION}
                      </Button>
                    )}
                  </div>
                </div>
                <div className='prose mt-2 text-gray-700'>
                  <MarkdownWithLinks content={question.explanation} />
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SimpleQuestionAnswerView
