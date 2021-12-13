import {Users} from "./users";

export interface Papers {
    id:       number;
    fields:   string[];
    title:    string;
    authors:  Users[];
    content:  string;
    links:    Papers[];
    versions: Papers[];
    score:    number;
}
