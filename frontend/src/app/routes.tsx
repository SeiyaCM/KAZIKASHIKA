import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from '@/App';

// Placeholder components for routing
function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<h1 className="text-3xl font-bold">Register Page</h1>
		</div>
	);
}

function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<h1 className="text-3xl font-bold">Login Page</h1>
		</div>
	);
}

export function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</BrowserRouter>
	);
}

