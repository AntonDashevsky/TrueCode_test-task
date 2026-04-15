import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class PostsQueryDto {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    page = 1;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    limit = 10;

    @IsOptional()
    @IsIn(['newest', 'oldest'])
    sort: 'newest' | 'oldest' = 'newest';
}
