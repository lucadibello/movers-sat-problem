import { Box } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { Forniture } from "services/solver-service";
import { DragItemType } from "util/drag";
import FornitureIcon from "./FornitureIcon";
import { FornitureCardElement } from "util/forniture";

export interface FloorItem {
	forniture: FornitureCardElement,
	worker?: string;
}

interface DroppableFloorProps {
	floorIndex: number;
	items: FloorItem[];
	onDrop: (item: FornitureCardElement) => void;
}

export default function DroppableFloor({ floorIndex, items, onDrop }: DroppableFloorProps) {
	// Make the floor droppable
	const [{ isOver }, drop] = useDrop({
		accept: DragItemType.FORNITURE,
		drop: (item: FornitureCardElement) => onDrop(item),
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

			{/* Render the items */}
			{items.map((item, index) => (
				<Box key={index} mb={2}>
					<FornitureIcon key={index} name={item.forniture.name} icon={item.forniture.icon} />
				</Box>
			))}
		</Box >
	)
}