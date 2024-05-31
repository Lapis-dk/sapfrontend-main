
import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import Login from "./pages/LoginForm";
import MainPage from "./pages/mainpage";
import Graph from "./pages/graph";


function App() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Login />} />
				<Route path="/textcategorization" element={<MainPage />} />
				<Route path="/analysis" element={<Graph />} />
			</Routes>
		</Router>
	);
}

export default App;
