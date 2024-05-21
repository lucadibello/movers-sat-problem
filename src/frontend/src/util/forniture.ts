import { IconType } from "react-icons";
import { FaArchive, FaBed, FaBicycle, FaCamera, FaCoffee, FaLaptop } from "react-icons/fa";

export type FornitureCardElement = {
	name: string;
	icon: IconType;
}

export const FORNITURE_CARDS: FornitureCardElement[] = [
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