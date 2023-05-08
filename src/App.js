import { BrowserRouter as Router } from "react-router-dom";
import LayoutComponent from "./components/layout";
import "./App.css";

function App() {
  return (
    <Router>
      <LayoutComponent />
    </Router>
  );
}

export default App;
