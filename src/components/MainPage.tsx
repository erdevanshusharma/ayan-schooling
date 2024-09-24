import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleQuestionAnswerView from "./SimpleQuestionAnswerView";

type TabValue =
  | "math"
  | "science"
  | "geography"
  | "englishGrammar"
  | "bigPicture";

interface ISubjectConfig {
  tabName: string;
  dataUrl: string;
  title: string;
}

const subjectConfig: ISubjectConfig[] = [
  {
    tabName: "math",
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/104ae6bc9843f34512d0b1f559e7c582/raw/mathsQuestions.json",
    title: "Maths Challenge",
  },
  {
    tabName: "science",
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/9e12748907fd91ce25a4d2fd23963e49/raw/scienceQuestions.json",
    title: "Science Challenge",
  },
  {
    tabName: "geography",
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/84c09f63952963e9e7bb2d24c91b2e63/raw/geographyQuestions.json",
    title: "Geography Challenge",
  },
  {
    tabName: "english",
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/32f73472dc5793a88a0c69eb449b791d/raw/englishGrammarQuestions.json",
    title: "English Grammar Challenge",
  },
  {
    tabName: "Big Picture",
    dataUrl:
      "https://gist.githubusercontent.com/erdevanshusharma/56a206859b9138a9d71d2420cbebe738/raw/bigPicture.json",
    title: "Big Picture Challenge",
  },
];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 sm:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-6xl font-bold text-white text-center mb-8"
      >
        Ayan's Learning Adventure
      </motion.h1>
      <Tabs
        value={activeTab}
        onValueChange={(tab) => handleTabChange(tab as TabValue)}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList
          className={`grid w-full grid-cols-5 rounded-xl bg-white/20 p-1`}
        >
          {subjectConfig.map((config) => (
            <TabsTrigger
              value={config.tabName}
              className="rounded-lg text-white hover:bg-white/10 data-[state=active]:bg-white/30"
            >
              <p className="capitalize">{config.tabName}</p>
            </TabsTrigger>
          ))}
        </TabsList>
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={tabVariants}
          transition={{ duration: 0.3 }}
        >
          {subjectConfig.map((config) => (
            <TabsContent value={config.tabName} key={config.tabName}>
              <SimpleQuestionAnswerView
                dataUrl={config.dataUrl}
                title={config.title}
              />
            </TabsContent>
          ))}
        </motion.div>
      </Tabs>
    </div>
  );
};

export default MainPage;
