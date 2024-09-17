import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

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
        private readonly _configService: ConfigService,

    ) {
        const cacheTTLMinutes = this._configService.getOrThrow<number>('cache.ttlMinutes');
        const minutesToMiliseconds = 60 * 1000;
        this.trendingCourses = new CacheBaseService<WithId<CourseWithoutReviews>[]>(this._cacheManager, CacheKeys.trending, { ttl: cacheTTLMinutes * minutesToMiliseconds });
    }
}