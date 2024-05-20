import { ApiResponse } from "..";

// Define the return type
interface MoverAction {
  type: string;
  data: any;
}

interface Mover {
  mover_name: string;
  current_floor: number;
  action: MoverAction | null;
}

export interface Forniture {
  forniture_name: string;
  current_floor: string;
}

interface SimulationStep {
  movers: Mover[];
  forniture: Forniture[];
}

type SolveResponse = {
  total_steps: number;
  movers_names: string[];
  forniture_names: string[];
  simulation_steps: SimulationStep[];
};

// Define response type
export type SolveApiResponse = ApiResponse<SolveResponse>;
