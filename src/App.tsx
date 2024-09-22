import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MathPage from "./components/MathPage";
import SciencePage from "./components/SciencePage";
import GeographyPage from "./components/GeographyPage";

const App = () => {
  const [activeTab, setActiveTab] = useState("math");

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
        onValueChange={setActiveTab}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-white/20 p-1">
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
        </TabsList>
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={tabVariants}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="math">
            <MathPage />
          </TabsContent>
          <TabsContent value="science">
            <SciencePage />
          </TabsContent>
          <TabsContent value="geography">
            <GeographyPage />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default App;
