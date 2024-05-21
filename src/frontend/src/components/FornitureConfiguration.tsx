import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useMovers } from "contexts/MoverContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableFloor from "./DroppableFloor";
import FornitureScrollGallery from "./FornitureScrollGallery";

export default function FornitureConfigurator() {
	// Load movers context to access settings
	const { floors } = useMovers()

	// Create a list of floors to place the forniture
	const floorElements = []

	for (var i = 0; i < floors; i++) {
		floorElements.push(
			<DroppableFloor floorIndex={i} items={[]} onDrop={() => { }} />
		)
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<VStack w="full" spacing={4} align="center" justify="center">
				{floorElements.map((floor, index) => (
					<Box w="full" key={index}>
						<HStack>
							<Text>Floor #{index + 1}</Text>
							{floor}
						</HStack>
					</Box>
				))}

				<FornitureScrollGallery />
			</VStack>
		</DndProvider>
	)
}