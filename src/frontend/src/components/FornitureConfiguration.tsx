import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useMovers } from "contexts/MoverContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableFloor from "./DroppableFloor";
import FornitureScrollGallery from "./FornitureScrollGallery";

interface FornitureConfiguratorProps {
	onSubmit: () => void;
	onBack: () => void;
}

export default function FornitureConfigurator({ onSubmit, onBack }: FornitureConfiguratorProps) {
	// Load movers context to access settings
	const { floors, forniture, addForniture, updateForniture, reset } = useMovers()

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
			<VStack minH="70vh" w="full" spacing={4} align="center" justify="center">
				{floorElements.map((Floor, index) => (
					<Box w="full" key={index}>
						<VStack>
							{floors - index - 1 === 0 ? <Text>Ground Floor</Text> : <Text>Floor #{floors - index - 1}</Text>}
							{/* Render the floor */}
							<Floor
								floorNo={floors - index - 1}
								items={forniture.filter((f) => f.floor === floors - index - 1)}
								onDrop={(card_element) => {
									// Remove the forniture from the previous floor if present
									if (card_element.floor !== undefined) {
										if (card_element.floor !== floors - index - 1) {
											console.log("Updating forniture with ID", card_element.id, "from", card_element.floor, "to", floors - index - 1)
											updateForniture(card_element, floors - index - 1)
										}
									} else {
										console.log("Adding new forniture to", floors - index - 1)
										addForniture(card_element, floors - index - 1)
									}
								}}
							/>
						</VStack>
					</Box>
				))}

				{/* Gallery of forniture */}
				<Text>Drag-and-drop the objects to the desired floor</Text>
				<FornitureScrollGallery />

				{/* Action buttons */}
				<VStack w="full">
					{/* Proceed */}
					<Button
						colorScheme="blue"
						w="full"
						onClick={onSubmit}
						isDisabled={forniture.length === 0}
					>
						Proceed
					</Button>
					{/* Go back */}
					<Button
						w="full"
						onClick={() => {
							reset()
							onBack()
						}}
						variant={"link"}
					>
						Go back
					</Button>
				</VStack>
			</VStack>
		</DndProvider>
	)
}