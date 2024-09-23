import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReactMarkdown from "react-markdown";

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

    const newShowExplanations = [...showExplanations];
    newShowExplanations[questionIndex] = true;
    setShowExplanations(newShowExplanations);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
      {simpleQuestions.map((question, questionIndex) => (
        <Card key={questionIndex} className="mb-8 bg-white/90 shadow-xl">
          <CardHeader>
            <h2 className="text-xl font-semibold text-purple-700">{`Question ${
              questionIndex + 1
            }`}</h2>
            <div className="flex flex-row gap-1">
              <p className="text-sm text-gray-500">
                Concept: {question.concept}
              </p>
              {question.conceptShortDefinition && (
                <p className="text-sm text-gray-500">
                  - {question.conceptShortDefinition}
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
                  className="flex items-center space-x-2 mb-1 px-4 py-4 bg-gradient-to-r from-purple-200 rounded-full"
                >
                  <RadioGroupItem
                    value={optionIndex.toString()}
                    id={`q${questionIndex}-option-${optionIndex}`}
                    className="border-2 border-purple-500"
                  />
                  <label
                    htmlFor={`q${questionIndex}-option-${optionIndex}`}
                    className="text-lg w-full font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-7"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
            {showExplanations[questionIndex] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4"
              >
                <p
                  className={`font-bold ${
                    answers[questionIndex] === question.correctAnswer
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {answers[questionIndex] === question.correctAnswer
                    ? "Correct!"
                    : "Not quite right. Try again!"}
                </p>
                <div className="text-gray-700 mt-2 prose">
                  <ReactMarkdown>{question.explanation}</ReactMarkdown>
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
