import {Users} from "./users";
import {Papers} from "./papers";

export interface Organisation {
    Name:         string;
    id:           number;
    location:     string;
    Members:      Users[];
    Publications: Papers[];
}
