import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Forniture, Mover } from 'services/solver-service';

interface MoversContextType {
	movers: Mover[];
	floors: number;
	numberOfMovers: number;
	maxTime: number;
	forniture: Forniture[];
	addMover: (mover: Mover) => void;
	updateMover: (id: string, newFloor: number) => void;
	setFloors: (floors: number) => void;
	setNumberOfMovers: (num: number) => void;
	setMaxTime: (time: number) => void;
	addForniture: (item: Forniture) => void;
}

const MoversContext = createContext<MoversContextType | undefined>(undefined);

const MoversProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [movers, setMovers] = useState<Mover[]>([]);
	const [floors, setFloors] = useState<number>(1);
	const [numberOfMovers, setNumberOfMovers] = useState<number>(1);
	const [maxTime, setMaxTime] = useState<number>(0);
	const [forniture, setForniture] = useState<Forniture[]>([]);

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

	const addForniture = (item: Forniture) => {
		setForniture((prevForniture) => [...prevForniture, item]);
	};

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
