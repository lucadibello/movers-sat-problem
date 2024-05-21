import { IconType } from "react-icons";
import { FaArchive, FaBed, FaBicycle, FaCamera, FaCoffee, FaLaptop } from "react-icons/fa";

export type FornitureItem = {
	name: string;
	icon: IconType;
	id?: number;
	floor?: number;
}

export const FORNITURE_CARDS: FornitureItem[] = [
	{
		"name": "Laptop",
		"icon": FaLaptop
	},
	{
		"name": "Bicycle",
		"icon": FaBicycle
	},
	{
		"name": "Boxes",
		"icon": FaArchive
	},
	{
		"name": "Table",
		"icon": FaBed
	},
	{
		"name": "Camera",
		"icon": FaCamera
	},
	{
		"name": "Coffee",
		"icon": FaCoffee
	}
]

// Create hashmap for faster access
export const FORNITURE_MAP: Record<string, FornitureItem> = FORNITURE_CARDS.reduce((acc, item) => {
	acc[item.name] = item
	return acc
}, {} as Record<string, FornitureItem>)