import { Box, Text, Icon } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { IconType } from "react-icons";
import { DragItemType } from "util/drag";

interface FornitureCardProps {
	id: number | string;
	icon: IconType;
	text: string;
}

export default function FornitureIcon({ id, icon, text }: FornitureCardProps) {
	const [collected, drag, dragPreview] = useDrag(() => ({
		type: DragItemType.FORNITURE,
		item: { id },
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	}))

	if (collected.isDragging) {
		return (
			<Box
				ref={dragPreview}
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
					{text}
				</Text>
			</Box>
		)
	} else {
		return (
			<Box
				ref={drag}
				{...collected}
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
					{text}
				</Text>
			</Box>
		)
	}
}