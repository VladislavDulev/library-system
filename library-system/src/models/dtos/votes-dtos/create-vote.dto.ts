import { IsNotEmpty, Min, IsInt, Max, IsEnum } from "class-validator";
import { Reaction } from "src/models/enums/reactions";

export class CreateVoteDTO {
    @IsNotEmpty()
    @IsEnum(Reaction)
    reaction: Reaction;
}