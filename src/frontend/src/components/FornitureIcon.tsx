import { Box, Text, Icon } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { IconType } from "react-icons";
import { DragItemType } from "util/drag";
import { FornitureItem } from "util/forniture";

interface FornitureCardProps {
	icon: IconType;
	name: string;
	currentFloor?: number;
	id?: number;
}

export default function FornitureIcon({ icon, name, currentFloor, id }: FornitureCardProps) {

	const [collected, dragRef, dragPreviewRef] = useDrag(() => ({
		type: DragItemType.FORNITURE,
		item: {
			name,
			icon,
			floor: currentFloor,
			id: id
		} as FornitureItem,
		collect: (monitor: any) => ({
			opacity: monitor.isDragging() ? 0.5 : 1,
			isDragging: monitor.isDragging(),
		}),
	}))

	const ref = collected.isDragging ? dragPreviewRef : dragRef

	return (
		<Box
			ref={ref}
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
				{name}
			</Text>
			<Text fontSize="sm" ml="auto">
				{currentFloor ? `Floor ${currentFloor}` : ""}
				{id ? `ID ${id}` : ""}
			</Text>
		</Box>
	)
}