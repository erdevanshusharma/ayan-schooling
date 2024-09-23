import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GeographyPage from "./GeographyPage";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleQuestionAnswerView from "./SimpleQuestionAnswerView";

type TabValue = "math" | "science" | "geography" | "englishGrammar";

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
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-white/20 p-1">
          <TabsTrigger
            value="math"
            className="rounded-lg text-white hover:bg-white/10 data-[state=active]:bg-white/30"
          >
            Maths
          </TabsTrigger>
          <TabsTrigger
            value="science"
            className="rounded-lg text-white hover:bg-white/10 data-[state=active]:bg-white/30"
          >
            Science
          </TabsTrigger>
          <TabsTrigger
            value="geography"
            className="rounded-lg text-white hover:bg-white/10 data-[state=active]:bg-white/30"
          >
            Geography
          </TabsTrigger>
          <TabsTrigger
            value="englishGrammar"
            className="rounded-lg text-white hover:bg-white/10 data-[state=active]:bg-white/30"
          >
            English
          </TabsTrigger>
        </TabsList>
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={tabVariants}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="math">
            <SimpleQuestionAnswerView
              dataUrl={
                "https://gist.githubusercontent.com/erdevanshusharma/104ae6bc9843f34512d0b1f559e7c582/raw/mathsQuestions.json"
              }
              title={"Maths Challenge"}
            />
          </TabsContent>
          <TabsContent value="science">
            <SimpleQuestionAnswerView
              dataUrl={
                "https://gist.githubusercontent.com/erdevanshusharma/9e12748907fd91ce25a4d2fd23963e49/raw/scienceQuestions.json"
              }
              title={"Science Challenge"}
            />
          </TabsContent>
          <TabsContent value="geography">
            <GeographyPage />
          </TabsContent>
          <TabsContent value="englishGrammar">
            <SimpleQuestionAnswerView
              dataUrl={
                "https://gist.githubusercontent.com/erdevanshusharma/32f73472dc5793a88a0c69eb449b791d/raw/englishGrammarQuestions.json"
              }
              title={"English Grammar Challenge"}
            />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default MainPage;
