import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { DragItemType } from "util/drag";
import DraggableFornitureIcon from "./FornitureIcon";
import { FornitureItem } from "util/forniture";

interface DroppableFloorProps {
	items: FornitureItem[];
	floorNo: number;
	onDrop: (item: FornitureItem) => void;
}

export default function DroppableFloor({ floorNo, items, onDrop }: DroppableFloorProps) {
	// Make the floor droppable
	const [{ isOver }, drop] = useDrop({
		accept: DragItemType.FORNITURE,
		drop: (item: FornitureItem) => onDrop(item),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	})

	// Load the color mode
	const hoverColor = useColorModeValue("gray.400", "gray.700")

	return (
		<Box
			ref={drop}
			w="full"
			p={4}
			borderWidth={1}
			borderRadius="lg"
			boxShadow="md"
			bg={isOver ? hoverColor : undefined}
			minH={"6em"}
		>
			{/* Render the items */}
			<HStack gap={2}>
				{items.map((item, index) => (
					<Box key={index} mb={2}>
						<DraggableFornitureIcon
							key={index}
							floor={floorNo}
							name={item.name}
							icon={item.icon}
							id={item.id}
						/>
					</Box>
				))}
			</HStack>
		</Box >
	)
}