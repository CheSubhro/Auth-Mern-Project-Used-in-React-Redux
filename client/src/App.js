
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './pages/Reusable/Header/Header'
// import Footer from './pages/Reusable/Footer/Footer'
import Home from './pages/HomePage/Home'
import About from './pages/AboutPage/About'
import Registation from './pages/AuthPage/Registation'
import Login from './pages/AuthPage/Login'
import Profile from './pages/AuthPage/Profile'


function App() {
	return (
		<>
			<Router>
                <Header />
                <Routes>
                    <Route exact path="/" element={< Home />} />
					<Route exact path="/about" element={< About />} />
					<Route exact path="/register" element={< Registation />} />
					<Route exact path="/login" element={< Login />} />
					<Route exact path="/profile" element={< Profile />} />
                </Routes>
                {/* <Footer /> */}
            </Router>
		</>		
	);
}

export default App;
