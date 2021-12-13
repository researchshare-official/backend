import {Papers} from "./papers";

export interface Users {
    first_name: string;
    last_name: string;
    orcid: string;
    avatar: string;
    publications: Papers[];
    votes: Papers[];
}