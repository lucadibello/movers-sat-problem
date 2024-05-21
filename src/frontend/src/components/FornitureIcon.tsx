import { Icon, Heading, VStack, Text } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { IconType } from "react-icons";
import { DragItemType } from "util/drag";
import { FornitureItem } from "util/forniture";

interface DraggableFornitureIconProps {
	icon: IconType;
	name: number | string;
	floor?: number;
	id?: number;
}

interface FornitureIconProps {
	icon: IconType;
	name: number | string;
	showBadge?: boolean;
	badgeColor?: string;
	badgeText?: string;
	isBadgeSmall?: boolean;
}

export function FornitureIcon({ icon, name, badgeColor, showBadge, badgeText, isBadgeSmall = false }: FornitureIconProps) {
	return (
		<VStack
			boxShadow="md"
			justifyContent={"center"}
			alignItems={"center"}
			rounded={"lg"}
			_hover={{
				bg: "gray.100",
			}}
			w="full"
			p={4}
		>
			<Icon as={icon} w={8} h={8} />
			<Heading size='sm'>{name}</Heading>
			{showBadge && (
				<VStack
					bg={badgeColor}
					rounded={"md"}
					px={2}
					py={1}
					color={"white"}
				>
					<Text fontSize={isBadgeSmall ? "md" : "xl"} >{badgeText}</Text>
				</VStack>
			)}
		</VStack>
	)
}

export default function DraggableFornitureIcon({ icon, name, floor, id }: DraggableFornitureIconProps) {
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
	)
}