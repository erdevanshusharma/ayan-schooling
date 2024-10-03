import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MarkdownWithLinks from "./MarkdownWithLinks";
import { Button } from "@/components/ui/button";

const POINTS_PER_QUESTION = 10;

const Score = ({
  points,
  numQuestions,
}: {
  points: number;
  numQuestions: number;
}) => {
  return (
    <div className="flex">
      {points} / {POINTS_PER_QUESTION * numQuestions}
    </div>
  );
};

interface SimpleQuestionAnswerData {
  question: string;
  options: string[];
  correctAnswer: number;
  concept: string;
  conceptShortDefinition: string;
  explanation: string;
}

const SimpleQuestionAnswerView = ({
  title,
  dataUrl,
}: {
  title: string;
  dataUrl: string;
}) => {
  const [simpleQuestions, setSimpleQuestions] = useState<
    SimpleQuestionAnswerData[]
  >([]);

  // Create an array of refs to store references to each card
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [totalPoints, setTotalPoints] = useState(0);
  const [shouldToggleMap, setShouldToggleMap] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleValueForIndex = (key: number) => {
    setShouldToggleMap((prevDict) => ({
      ...prevDict, // Copy the existing dictionary
      [key]: !prevDict[key], // Toggle the value of the specific key
    }));
  };

  useEffect(() => {
    const fetchGistData = async () => {
      const cacheBustedUrl = `${dataUrl}?t=${new Date().getTime()}`;
      const response = await fetch(cacheBustedUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSimpleQuestions(result.data);
    };

    fetchGistData();
  }, [dataUrl]);

  const [answers, setAnswers] = useState(
    Array(simpleQuestions.length).fill(null)
  );
  const [showExplanations, setShowExplanations] = useState(
    Array(simpleQuestions.length).fill(false)
  );

  const handleAnswerChange = (questionIndex: number, answerIndex: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = +answerIndex;
    setAnswers(newAnswers);

    const nextCardRef = cardRefs.current[questionIndex + 1]; // Get reference to the next card
    if (nextCardRef) {
      nextCardRef.scrollIntoView({
        behavior: "smooth", // Smooth scrolling
        block: "start", // Align the next card to the top
      });
    }
  };

  const handleSubmit = (questionIndex: number) => {
    const newShowExplanations = [...showExplanations];
    newShowExplanations[questionIndex] = true;
    setShowExplanations(newShowExplanations);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 flex gap-2">
        {title} -{" "}
        {Score({ points: totalPoints, numQuestions: simpleQuestions.length })}
      </h1>
      {simpleQuestions.map((question, questionIndex) => (
        <Card
          key={questionIndex}
          ref={(el) => (cardRefs.current[questionIndex] = el)} // Store reference to the current card
          className="mb-8 bg-white/90 shadow-xl"
        >
          <CardHeader>
            <h2 className="text-xl font-semibold text-purple-700">{`Question ${
              questionIndex + 1
            }`}</h2>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">
                Concept: {question.concept}
              </p>
              {question.conceptShortDefinition && (
                <p className="text-sm text-gray-500">
                  {question.conceptShortDefinition}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{question.question}</p>
            <RadioGroup
              value={answers[questionIndex]?.toString()}
              onValueChange={(value: string) =>
                handleAnswerChange(questionIndex, value)
              }
            >
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="flex items-center space-x-2 mb-1 bg-gradient-to-r from-purple-200 rounded-full hover:from-purple-300 px-4 cursor-pointer"
                >
                  <RadioGroupItem
                    value={optionIndex.toString()}
                    id={`q${questionIndex}-option-${optionIndex}`}
                    className="border-2 border-purple-500"
                  />
                  <label
                    htmlFor={`q${questionIndex}-option-${optionIndex}`}
                    className="text-sm w-full font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-7 py-4 cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
            {answers[questionIndex]?.toString() && (
              <Button
                onClick={() => handleSubmit(questionIndex)}
                className="mt-4 bg-purple-600 hover:bg-purple-700 rounded-full"
              >
                Check Answer
              </Button>
            )}
            {showExplanations[questionIndex] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4"
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
                <div className="flex flex-row justify-between">
                  <p className="font-bold text-purple-600">
                    Did you get it right?
                  </p>
                  <div className="flex gap-2 items-center">
                    Score:
                    {Score({
                      points: totalPoints,
                      numQuestions: simpleQuestions.length,
                    })}
                    {shouldToggleMap[questionIndex] === true ? (
                      <Button
                        onClick={() => {
                          toggleValueForIndex(questionIndex);
                          setTotalPoints(totalPoints - POINTS_PER_QUESTION);
                        }}
                        className="ml-2 bg-red-500 hover:bg-red-700 rounded-full"
                      >
                        Subtract {POINTS_PER_QUESTION}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          toggleValueForIndex(questionIndex);
                          setTotalPoints(totalPoints + POINTS_PER_QUESTION);
                        }}
                        className="ml-2 bg-purple-600 hover:bg-purple-700 rounded-full"
                      >
                        Add {POINTS_PER_QUESTION}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-gray-700 mt-2 prose">
                  <MarkdownWithLinks content={question.explanation} />
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SimpleQuestionAnswerView;
