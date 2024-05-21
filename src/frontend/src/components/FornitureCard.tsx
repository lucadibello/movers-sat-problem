import { Box, Text, Icon } from "@chakra-ui/react";

interface FornitureCardProps {
	icon: any;
	text: string;
}

export default function FornitureCard({ icon, text }: FornitureCardProps) {
	return (
		<Box
			borderWidth="1px"
			borderRadius="lg"
			overflow="hidden"
			padding="4"
			display="flex"
			alignItems="center"
			boxShadow="md"
		>
			<Icon as={icon} w={8} h={8} mr={4} />
			<Text fontSize="lg" fontWeight="bold">
				{text}
			</Text>
		</Box>
	);
}