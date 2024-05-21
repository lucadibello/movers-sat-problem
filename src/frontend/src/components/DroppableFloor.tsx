import { Box, Text } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { Forniture } from "services/solver-service";

export interface FloorItem {
	forniture: Forniture,
	worker?: string;
}

interface DroppableFloorProps {
	floorIndex: number;
	items: FloorItem[];
	onDrop: (item: Forniture) => void;
}

export default function DroppableFloor({ floorIndex, items, onDrop }: DroppableFloorProps) {
	// Make the floor droppable
	const [{ isOver }, drop] = useDrop({
		accept: "accept",
		drop: (item: Forniture) => onDrop(item),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	})

	return (
		<Box
			ref={drop}
			w="full"
			p={4}
			borderWidth={1}
			borderRadius="lg"
			boxShadow="md"
			bg={isOver ? "gray.100" : "white"}
			minH={"6em"}
		>


		</Box>
	)
}