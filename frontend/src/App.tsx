import { Link } from 'react-router-dom';

export function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="text-5xl font-bold text-gray-900 mb-6">
						KAZIKASHIKA
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						家事を記録して、家族の貢献を可視化する
					</p>
					<div className="flex gap-4 justify-center">
						<Link
							to="/register"
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							新規登録
						</Link>
						<Link
							to="/login"
							className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
						>
							ログイン
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

