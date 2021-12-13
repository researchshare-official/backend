import {Papers} from "./papers";
import {Laboratory} from "./laboratory";

export interface Users {
    first_name: string;
    last_name: string;
    orcid: string;
    avatar: string;
    publications: Papers[];
    votes: Papers[];
    laboratories: Laboratory[];
}