import { ApiResponse } from "..";

// Define the return type
interface MoverAction {
	type: string;
	data: any;
}

export interface Mover {
	name: string;
	floor: number;
}

interface MoverWithAction extends Mover {
	action: MoverAction | null;
}

export interface Forniture {
	name: string;
	floor: number;
}

export interface SimulationStep {
	movers: MoverWithAction[];
	forniture: Forniture[];
}

export type SolveResponse = {
	total_steps: number;
	movers_names: string[];
	forniture_names: string[];
	simulation_steps: SimulationStep[];
};

// Define response type
export type SolveApiResponse = ApiResponse<SolveResponse>;
