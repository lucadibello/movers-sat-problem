import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useMovers } from "contexts/MoverContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableFloor from "./DroppableFloor";
import FornitureScrollGallery from "./FornitureScrollGallery";

export default function FornitureConfigurator() {
	// Load movers context to access settings
	const { floors, forniture, addForniture, updateForniture } = useMovers()

	// Create a list of floors to place the forniture
	const floorElements = []

	// Create the floors
	for (var i = 0; i < floors; i++) {
		floorElements.push(DroppableFloor)
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<VStack w="full" spacing={4} align="center" justify="center">
				{floorElements.map((Floor, index) => (
					<Box w="full" key={index}>
						<HStack>
							<Text>Floor #{index + 1}</Text>
							{/* Render the floor */}
							<Floor
								floorNo={index}
								items={forniture.filter((f) => f.floor === index)}
								onDrop={(card_element) => {
									console.log(card_element, "Floor", index, "Dropped!")

									// Remove the forniture from the previous floor if present
									if (card_element.floor !== undefined) {
										console.log("Updating forniture")
										updateForniture(card_element, index)
									} else {
										console.log("Adding new forniture")
										addForniture(card_element, index)
									}
								}}
							/>
						</HStack>
					</Box>
				))}

				<FornitureScrollGallery />
			</VStack>
		</DndProvider>
	)
}