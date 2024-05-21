import { useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useMovers } from "contexts/MoverContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableFloor from "./DroppableFloor";
import FornitureScrollGallery from "./FornitureScrollGallery";
import { FornitureCardElement } from "util/forniture";

interface FornitureAtFloor {
	id: number;
	floor: number;
	forniture: FornitureCardElement;
}

export default function FornitureConfigurator() {
	// Load movers context to access settings
	const { floors } = useMovers()

	// Load the React State
	const [fornitures, setFornitures] = useState<FornitureAtFloor[]>([])

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
								floorIndex={index}
								items={fornitures.filter((f) => f.floor === index)}
								onDrop={(card_element) => {
									console.log(card_element, "Floor", index, "Dropped!")
									setFornitures([
										...fornitures,
										{
											id: fornitures.length,
											floor: index,
											forniture: card_element
										}
									])
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