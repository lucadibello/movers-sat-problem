import { Icon, Heading, VStack } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { IconType } from "react-icons";
import { DragItemType } from "util/drag";
import { FornitureItem } from "util/forniture";

interface FornitureCardProps {
	icon: IconType;
	name: string;
	floor?: number;
	id?: number;
}

export default function FornitureIcon({ icon, name, floor, id }: FornitureCardProps) {
	const [collected, dragRef, dragPreviewRef] = useDrag(() => ({
		type: DragItemType.FORNITURE,
		item: {
			name,
			icon,
			floor,
			id
		} as FornitureItem,
		collect: (monitor: any) => ({
			opacity: monitor.isDragging() ? 0.5 : 1,
			isDragging: monitor.isDragging(),
		}),
	}))

	const ref = collected.isDragging ? dragPreviewRef : dragRef

	return (
		<>
			<VStack
				ref={ref}
				boxShadow="md"
				justifyContent={"center"}
				alignItems={"center"}
				rounded={"lg"}
				_hover={{
					bg: "gray.100",
				}}
				w="full"
				h="80px"
				p={4}
			>
				<Icon as={icon} w={8} h={8} />
				<Heading size='sm'>{name}</Heading>
			</VStack>
		</>
	)
}