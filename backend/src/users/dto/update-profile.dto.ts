import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;

    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    about?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;
}
