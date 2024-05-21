
interface FornitureGalleryProps {
	forniture: Array<{
		name: string;
		icon: any;
	}>;
	onSelect: (name: string) => void;
}

export default function FornitureGallery({ forniture }: FornitureGalleryProps) {
	return (
		<>
			{/* Forniture gallery */}
		</>
	)
}