import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './dialog';

export function ComponentExample() {
	return (
		<div className="container mx-auto p-8 space-y-8">
			<h1 className="text-4xl font-bold mb-8">shadcn/ui Components Example</h1>

			{/* Button Examples */}
			<section>
				<h2 className="text-2xl font-semibold mb-4">Buttons</h2>
				<div className="flex gap-4 flex-wrap">
					<Button>Default</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="link">Link</Button>
				</div>
			</section>

			{/* Input Examples */}
			<section>
				<h2 className="text-2xl font-semibold mb-4">Input</h2>
				<div className="max-w-sm space-y-4">
					<div>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
						/>
					</div>
					<div>
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="Enter your password"
						/>
					</div>
				</div>
			</section>

			{/* Card Examples */}
			<section>
				<h2 className="text-2xl font-semibold mb-4">Cards</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Card Title</CardTitle>
							<CardDescription>Card Description</CardDescription>
						</CardHeader>
						<CardContent>
							<p>This is the card content area.</p>
						</CardContent>
						<CardFooter>
							<Button>Action</Button>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Another Card</CardTitle>
							<CardDescription>
								With different content
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Cards are great for organizing content.</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Dialog Example */}
			<section>
				<h2 className="text-2xl font-semibold mb-4">Dialog</h2>
				<Dialog>
					<DialogTrigger asChild>
						<Button>Open Dialog</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Dialog Title</DialogTitle>
							<DialogDescription>
								This is a dialog description. You can place any
								content here.
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<p>Dialog content goes here.</p>
						</div>
					</DialogContent>
				</Dialog>
			</section>
		</div>
	);
}

