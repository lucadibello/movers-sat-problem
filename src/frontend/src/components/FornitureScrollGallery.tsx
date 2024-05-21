import { HStack } from "@chakra-ui/react";
import { FORNITURE_CARDS } from "util/forniture";
import FornitureIcon from "./FornitureIcon";

export default function FornitureScrollGallery() {
	return (
		<HStack w="100wh" overflowX="scroll" spacing={4} p={4}>
			{/* Forniture cards */}
			{FORNITURE_CARDS.map((card, index) => (
				<FornitureIcon name={card.name} icon={card.icon} key={index} />
			))}
		</HStack>
	)
}