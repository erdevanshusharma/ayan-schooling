import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleQuestionAnswerView from "./SimpleQuestionAnswerView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TabValue =
  | "math"
  | "science"
  | "geography"
  | "englishGrammar"
  | "bigPicture";

interface ISubjectConfig {
  dataUrl: string;
  title: string;
}

const subjectConfig: { [key: string]: ISubjectConfig } = {
  math: {
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/104ae6bc9843f34512d0b1f559e7c582/raw/mathsQuestions.json",
    title: "Maths Challenge",
  },
  science: {
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/9e12748907fd91ce25a4d2fd23963e49/raw/scienceQuestions.json",
    title: "Science Challenge",
  },

  geography: {
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/84c09f63952963e9e7bb2d24c91b2e63/raw/geographyQuestions.json",
    title: "Geography Challenge",
  },

  english: {
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/32f73472dc5793a88a0c69eb449b791d/raw/englishGrammarQuestions.json",
    title: "English Grammar Challenge",
  },

  ethics: {
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/3e04a3e7e1085ce5c6b8d7f997f93422/raw/ethics.json",
    title: "Ethics Challenge",
  },

  "Big Picture": {
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/56a206859b9138a9d71d2420cbebe738/raw/bigPicture.json",
    title: "Big Picture Challenge",
  },
};

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("math");

  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") as TabValue | null;
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const selectedConfig = subjectConfig[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col items-center from-purple-400 via-pink-500 to-red-500 p-4 sm:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-6xl font-bold text-white text-center mb-8"
      >
        Ayan's Learning Adventure
      </motion.h1>
      <Select onValueChange={(tab) => handleTabChange(tab as TabValue)}>
        <SelectTrigger className="w-fit capitalize text-3xl px-12 rounded-full border-none bg-purple-400/50 focus:outline-none py-8 focus:ring-0 focus:border-none focus:ring-offset-0">
          <SelectValue placeholder={selectedConfig.title} />
        </SelectTrigger>
        <SelectContent className=" flex flex-col p-2 rounded-lg justify-center max-h-screen">
          {Object.entries(subjectConfig).map(([tabName, config]) => (
            <SelectItem
              value={tabName}
              key={tabName}
              className="items-center cursor-pointer"
            >
              <p className="capitalize text-3xl px-8 py-4">{config.title}</p>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        variants={tabVariants}
        transition={{ duration: 0.3 }}
      >
        <SimpleQuestionAnswerView dataUrl={selectedConfig.dataUrl} />
      </motion.div>
    </div>
  );
};

export default MainPage;
