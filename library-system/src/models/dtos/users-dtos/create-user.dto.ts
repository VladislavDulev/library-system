import { IsString, IsNotEmpty, Min, Length, max } from "class-validator";
import { Limits } from "src/models/enums/limits";

export class CreateUserDTO {
    @IsString()
    @Length(Limits.MIN_USERNAME_LENGTH, Limits.MAX_USERNAME_LENGTH)
    @IsNotEmpty()
    username: string;

    @IsString()
    @Length(Limits.MIN_PASSWORD_LENGTH, Limits.MAX_PASSWORD_LENGTH)
    @IsNotEmpty()
    password: string;

    @IsString()
    @Length(Limits.MIN_PASSWORD_LENGTH, Limits.MAX_PASSWORD_LENGTH)
    @IsNotEmpty()
    repeatpassword: string;
}