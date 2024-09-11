import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

import { CourseWithoutReviews } from 'src/database/documents/course';

import { CacheBaseService } from './modules/cache.base.service';

enum CacheKeys {
    trending = 'trending',
}

@Injectable()
export class CacheService {
    public readonly trendingCourses: CacheBaseService<WithId<CourseWithoutReviews>[]>;

    constructor(
        @Inject(CACHE_MANAGER) private _cacheManager: Cache,
    ) {
        this.trendingCourses = new CacheBaseService<WithId<CourseWithoutReviews>[]>(this._cacheManager, CacheKeys.trending, { ttl: 60 * 20 });
    }
}