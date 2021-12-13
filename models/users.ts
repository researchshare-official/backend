import {Papers} from "./papers";
import {Organisation} from "./organisation";

export interface Users {
    first_name: string;
    last_name: string;
    orcid: string;
    avatar: string;
    publications: Papers[];
    votes: Papers[];
    organisations: Organisation[];
}