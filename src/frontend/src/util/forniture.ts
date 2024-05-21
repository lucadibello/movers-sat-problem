import { IconType } from "react-icons";
import { FaBed, FaBicycle } from "react-icons/fa";

type FornitureCardElement = {
	name: string;
	icon: IconType;
}

export const FORNITURE_CARDS: FornitureCardElement[] = [
	{
		"name": "Sofa",
		"icon": FaBed
	},
	{
		"name": "Bicycle",
		"icon": FaBicycle
	}
]