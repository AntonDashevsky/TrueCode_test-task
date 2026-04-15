import { IsArray, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Transform, type TransformFnParams } from 'class-transformer';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    text?: string;

    @IsOptional()
    @Transform(({ value }: TransformFnParams): string[] => {
        if (!value) return [];
        if (Array.isArray(value)) {
            return value
                .filter((item): item is string => typeof item === 'string')
                .map((item) => item.trim());
        }
        if (typeof value === 'string') {
            try {
                const parsed: unknown = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return parsed
                        .filter((item): item is string => typeof item === 'string')
                        .map((item) => item.trim());
                }
            } catch {
                return value.split(',').map((item) => item.trim());
            }
        }
        return [];
    })
    @IsArray()
    @IsUUID('4', { each: true })
    removeImageIds?: string[];
}
