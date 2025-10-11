import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@kazikashika/backend/src/trpc/router';

// Create tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Get API URL from environment variable, fallback to localhost for development
const getApiUrl = () => {
	if (typeof window !== 'undefined') {
		// Client-side
		return import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc';
	}
	return 'http://localhost:3000/trpc';
};

// Create tRPC client
export const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			url: getApiUrl(),
			// You can add headers here (e.g., authentication tokens)
			headers: () => {
				return {
					// Authorization: `Bearer ${token}`,
				};
			},
		}),
	],
});
