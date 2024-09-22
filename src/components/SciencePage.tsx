import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface ScienceData {
  question: string;
  options: string[];
  correctAnswer: number;
  sense: string;
  explanation: string;
  ponderingThought: string;
  experiment: string;
}

const SciencePage = () => {
  const [scienceQuestions, setScienceQuestions] = useState<ScienceData[]>([]);

  useEffect(() => {
    const fetchGistData = async () => {
      const response = await fetch(
        "https://gist.githubusercontent.com/erdevanshusharma/9e12748907fd91ce25a4d2fd23963e49/raw/scienceQuestions.json"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setScienceQuestions(result.data);
    };

    fetchGistData();
  }, []);

  const [answers, setAnswers] = useState(
    Array(scienceQuestions.length).fill(null)
  );
  const [showExplanations, setShowExplanations] = useState(
    Array(scienceQuestions.length).fill(false)
  );

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
      <h1 className="text-3xl font-bold text-center mb-6">Science Discovery</h1>
      {scienceQuestions.map((question, questionIndex) => (
        <Card key={questionIndex} className="mb-8 bg-white/90 shadow-xl">
          <CardHeader>
            <h2 className="text-xl font-semibold text-green-700">{`Question ${
              questionIndex + 1
            }`}</h2>
            <p className="text-sm text-gray-500">Sense: {question.sense}</p>
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
                    className="border-2 border-green-500"
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
              className="mt-4 bg-green-600 hover:bg-green-700"
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
                <p
                  className="text-gray-700 mt-2 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: question.explanation.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    ),
                  }}
                ></p>
                <p className="text-blue-600 mt-2 italic">
                  {question.ponderingThought}
                </p>
                <div className="bg-yellow-100 p-4 rounded-lg mt-4">
                  <h3 className="font-bold text-yellow-800">
                    Let's Experiment!
                  </h3>
                  <p className="text-yellow-800">{question.experiment}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SciencePage;
