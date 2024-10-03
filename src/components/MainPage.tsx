import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SimpleQuestionAnswerView from './SimpleQuestionAnswerView'

type TabValue = 'math' | 'science' | 'geography' | 'englishGrammar' | 'bigPicture'

interface ISubjectConfig {
  dataUrl: string
  title: string
}

const subjectConfig: { [key: string]: ISubjectConfig } = {
  math: {
    dataUrl:
      'https://gist.githubusercontent.com/erdevanshusharma/104ae6bc9843f34512d0b1f559e7c582/raw/mathsQuestions.json',
    title: 'Maths Challenge',
  },
  science: {
    dataUrl:
      'https://gist.githubusercontent.com/erdevanshusharma/9e12748907fd91ce25a4d2fd23963e49/raw/scienceQuestions.json',
    title: 'Science Challenge',
  },

  geography: {
    dataUrl:
      'https://gist.githubusercontent.com/erdevanshusharma/84c09f63952963e9e7bb2d24c91b2e63/raw/geographyQuestions.json',
    title: 'Geography Challenge',
  },

  english: {
    dataUrl:
      'https://gist.githubusercontent.com/erdevanshusharma/32f73472dc5793a88a0c69eb449b791d/raw/englishGrammarQuestions.json',
    title: 'English Grammar Challenge',
  },

  ethics: {
    dataUrl:
      'https://gist.githubusercontent.com/erdevanshusharma/3e04a3e7e1085ce5c6b8d7f997f93422/raw/ethics.json',
    title: 'Ethics Challenge',
  },

  space: {
    dataUrl:
      'https://gist.githubusercontent.com/erdevanshusharma/19a59404e47e9b8bd0d4172792a50bbc/raw/space.json',
    title: 'Space Challenge',
  },

  'Big Picture': {
    dataUrl:
      'https://gist.githubusercontent.com/erdevanshusharma/56a206859b9138a9d71d2420cbebe738/raw/bigPicture.json',
    title: 'Big Picture Challenge',
  },
}

const MainPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [activeConfigName, setActiveConfigName] = useState('math')
  const [isOpen, setIsOpen] = useState(false) // State to control the dialog

  const handleTabChange = (configName: string) => {
    setIsOpen(false) // Close the dialog when an option is clicked

    setActiveConfigName(configName)
    navigate(`?tab=${configName}`)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab') as TabValue | null
    if (tab) {
      setActiveConfigName(tab)
    }
  }, [location])

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const selectedConfig = subjectConfig[activeConfigName]

  return (
    <div className='flex min-h-screen flex-col items-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 sm:p-8'>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-8 text-center text-4xl font-bold text-white sm:text-6xl'
      >
        Ayan's Learning Adventure
      </motion.h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Button that opens the dialog */}
        <DialogTrigger asChild>
          <button
            className='rounded-full bg-purple-600 px-10 py-4 text-white shadow-lg transition hover:bg-purple-700'
            style={{
              backgroundImage: `url('/ayan-schooling/images/${activeConfigName}.jpg')`, // Image from the public folder
              backgroundSize: 'cover', // Ensure image covers the entire button
              backgroundPosition: 'center', // Center the background image
            }}
          >
            <p className='text-xl capitalize'>{selectedConfig.title}</p>
          </button>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent className='flex h-full w-full items-center justify-center overflow-y-auto bg-purple-50 p-4 sm:max-h-full sm:max-w-full'>
          {/* Motion component for animating the dialog */}
          <motion.div
            initial={{ opacity: 0, y: 100 }} // Start below screen
            animate={{ opacity: 1, y: 0 }} // Animate into view
            exit={{ opacity: 0, y: 100 }} // Animate out of view
            transition={{ duration: 0.5 }} // Smooth transition
            className='h-full w-full'
          >
            <div className='grid h-full w-full grid-cols-1 gap-10 sm:grid-cols-3'>
              {Object.entries(subjectConfig).map(([configName, config]) => (
                <button
                  key={configName}
                  className='flex items-center justify-center rounded-full bg-purple-200 p-10 text-lg text-white hover:bg-purple-300'
                  onClick={() => {
                    handleTabChange(configName as TabValue)
                  }}
                  style={{
                    backgroundImage: `url('/ayan-schooling/images/${configName}.jpg')`, // Image from the public folder
                    backgroundSize: 'cover', // Ensure image covers the entire button
                    backgroundPosition: 'center', // Center the background image
                  }}
                >
                  <p className='py-4 text-5xl capitalize shadow-md'>{config.title}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
      <motion.div
        key={activeConfigName}
        initial='hidden'
        animate='visible'
        variants={tabVariants}
        transition={{ duration: 0.3 }}
      >
        <SimpleQuestionAnswerView dataUrl={selectedConfig.dataUrl} />
      </motion.div>
    </div>
  )
}

export default MainPage
