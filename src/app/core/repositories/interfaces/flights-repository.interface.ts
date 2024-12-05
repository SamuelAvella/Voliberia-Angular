import { Flight } from "../../models/flight.model";
import { IBaseRepository } from "./base-repository.interface";

export interface IFlightsRepository extends IBaseRepository<Flight>{
    
}