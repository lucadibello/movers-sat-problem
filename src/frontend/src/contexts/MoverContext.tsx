import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Mover } from 'services/solver-service';
import { FornitureItem } from 'util/forniture';

interface MoversContextType {
	movers: Mover[];
	floors: number;
	numberOfMovers: number;
	maxTime: number;
	forniture: FornitureItem[];
	addMover: (mover: Mover) => void;
	updateMover: (id: string, newFloor: number) => void;
	setFloors: (floors: number) => void;
	setNumberOfMovers: (num: number) => void;
	setMaxTime: (time: number) => void;
	addForniture: (item: FornitureItem, newFloor: number) => void;
	updateForniture: (item: FornitureItem, newFloor: number) => void;
}

const MoversContext = createContext<MoversContextType | undefined>(undefined);

const MoversProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// Simulation settings
	const [floors, setFloors] = useState<number>(1);
	const [numberOfMovers, setNumberOfMovers] = useState<number>(1);
	const [maxTime, setMaxTime] = useState<number>(0);
	const [index, setIndex] = useState<number>(1); // IDs start from 1

	// Simulation elements
	const [movers, setMovers] = useState<Mover[]>([]);
	const [forniture, setForniture] = useState<FornitureItem[]>([]);

	const addMover = (mover: Mover) => {
		setMovers((prevMovers) => [...prevMovers, mover]);
	};

	const updateMover = (name: string, newFloor: number) => {
		setMovers((prevMovers) =>
			prevMovers.map((mover) =>
				mover.name === name ? { ...mover, currentFloor: newFloor } : mover
			)
		);
	};

	const addForniture = (item: FornitureItem, newFloor: number) => {
		// Generate a new ID for the forniture
		item.id = getNewID();
		setForniture((prevForniture) => [...prevForniture, {
			...item,
			floor: newFloor
		}]);
	};

	const updateForniture = (item: FornitureItem, newFloor: number) => {
		setForniture((prevForniture) =>
			prevForniture.map((forniture) =>
				forniture.id === item.id && forniture.floor !== newFloor ? { ...forniture, floor: newFloor } : forniture
			)
		);
	}

	const getNewID = () => {
		setIndex((prevIndex) => prevIndex + 1);
		return index;
	}

	return (
		<MoversContext.Provider
			value={{
				movers,
				floors,
				numberOfMovers,
				maxTime,
				forniture,
				addMover,
				updateMover,
				setFloors,
				setNumberOfMovers,
				setMaxTime,
				addForniture,
				updateForniture,
			}}
		>
			{children}
		</MoversContext.Provider>
	);
};

const useMovers = (): MoversContextType => {
	const context = useContext(MoversContext);
	if (!context) {
		throw new Error('useMovers must be used within a MoversProvider');
	}
	return context;
};

export { MoversProvider, useMovers };
