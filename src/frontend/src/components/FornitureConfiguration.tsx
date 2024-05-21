import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useMovers } from "contexts/MoverContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableFloor from "./DroppableFloor";
import FornitureScrollGallery from "./FornitureScrollGallery";

interface FornitureConfiguratorProps {
	onSubmit: () => void;
}

export default function FornitureConfigurator({ onSubmit }: FornitureConfiguratorProps) {
	// Load movers context to access settings
	const { floors, forniture, addForniture, updateForniture } = useMovers()

	// Create a list of floors to place the forniture
	const floorElements = []

	// Create the floors
	for (var i = 0; i < floors; i++) {
		floorElements.push(DroppableFloor)
	}
	console.log("Forniture", forniture)

	return (
		<DndProvider backend={HTML5Backend}>
			<Heading as="h1" size="lg">Forniture Configuration</Heading>
			<VStack w="full" spacing={4} align="center" justify="center">
				{floorElements.map((Floor, index) => (
					<Box w="full" key={index}>
						<VStack>
							<Text>Floor #{floors - index}</Text>
							{/* Render the floor */}
							<Floor
								floorNo={floors - index}
								items={forniture.filter((f) => f.floor === floors - index)}
								onDrop={(card_element) => {
									// Remove the forniture from the previous floor if present
									if (card_element.floor !== undefined) {
										if (card_element.floor !== floors - index) {
											console.log("Updating forniture with ID", card_element.id, "from", card_element.floor, "to", floors - index)
											updateForniture(card_element, floors - index)
										}
									} else {
										console.log("Adding new forniture to", floors - index)
										addForniture(card_element, floors - index)
									}
								}}
							/>
						</VStack>
					</Box>
				))}

				{/* Gallery of forniture */}
				<Text>Drag-and-drop the objects to the desired floor</Text>
				<FornitureScrollGallery />

				{/* Proceed */}
				<Box w="full">
					<Button
						colorScheme="blue"
						w="full"
						onClick={onSubmit}
						isDisabled={forniture.length === 0}
					>
						Proceed
					</Button>
				</Box>
			</VStack>
		</DndProvider>
	)
}