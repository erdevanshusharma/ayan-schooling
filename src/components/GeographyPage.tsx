import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { FaMap } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface GeographyData {
  question: string;
  options: string[];
  correctAnswer: number;
  location: string;
  explanation: string;
}

const GeographyPage = () => {
  const [geographyQuestions, setGeographyQuestions] = useState<GeographyData[]>(
    []
  );

  useEffect(() => {
    const fetchGistData = async () => {
      const rawUrl =
        "https://gist.githubusercontent.com/erdevanshusharma/84c09f63952963e9e7bb2d24c91b2e63/raw/geographyQuestions.json";
      const cacheBustedUrl = `${rawUrl}?t=${new Date().getTime()}`;
      const response = await fetch(cacheBustedUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setGeographyQuestions(result.data);
    };

    fetchGistData();
  }, []);

  const [answers, setAnswers] = useState(
    Array(geographyQuestions?.length).fill(null)
  );
  const [showExplanations, setShowExplanations] = useState(
    Array(geographyQuestions?.length).fill(false)
  );

  if (!geographyQuestions) {
    return <div>Loading...</div>;
  }

  const handleAnswerChange = (questionIndex: number, answerIndex: string) => {
    const newAnswers = [...answers];

    newAnswers[questionIndex] = +answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = (questionIndex: number) => {
    const newShowExplanations = [...showExplanations];
    newShowExplanations[questionIndex] = true;
    setShowExplanations(newShowExplanations);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Geography Explorer
      </h1>
      {geographyQuestions.map((question, questionIndex) => (
        <Card key={questionIndex} className="mb-8 bg-white/90 shadow-xl">
          <CardHeader>
            <h2 className="text-xl font-semibold text-blue-700">{`Question ${
              questionIndex + 1
            }`}</h2>
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
                  className="flex items-center space-x-2 mb-2"
                >
                  <RadioGroupItem
                    value={optionIndex.toString()}
                    id={`q${questionIndex}-option-${optionIndex}`}
                    className="border-2 border-blue-500"
                  />
                  <label
                    htmlFor={`q${questionIndex}-option-${optionIndex}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
            <Button
              onClick={() => handleSubmit(questionIndex)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Check Answer
            </Button>
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
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    className="text-blue-600 flex gap-2 items-center"
                    href={`http://maps.google.com/?t=k&q="${question.location}"`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaMap /> Explore {question.location}
                  </a>
                  <a
                    className="text-red-600 flex gap-2 items-center"
                    href={`https://www.youtube.com/results?search_query=${
                      question.question
                    } ${question.options[question.correctAnswer]}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaYoutube /> Look up on Youtube
                  </a>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GeographyPage;
