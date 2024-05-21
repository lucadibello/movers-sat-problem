import { Box, Text, Icon, Card, CardBody, Heading, Stack } from "@chakra-ui/react";
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
		<Stack
			ref={ref}
			boxShadow="md"
			justifyContent={"center"}
			alignItems={"center"}
			p={4}
			rounded={"lg"}
			_hover={{
				bg: "gray.100",
			}}
			w="80px"
			h="80px"
		>
			<Icon as={icon} w={8} h={8} />
			<Heading size='sm'>{name}</Heading>
		</Stack>
	)
}