import { IsArray, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    text?: string;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    removeImageIds?: string[];
}
