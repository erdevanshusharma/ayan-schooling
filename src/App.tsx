import { BrowserRouter as Router } from "react-router-dom";
import MainPage from "./components/MainPage";

const App = () => {
  return (
    <Router>
      <MainPage />
    </Router>
  );
};

export default App;
