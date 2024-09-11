import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class CacheBaseService<T> {
    constructor(
        private _cacheManager: Cache,
        private readonly _cacheKey: string,
        private readonly _options?: { ttl?: number },
    ) {}

    public async set(value: T): Promise<void> {
        return this._cacheManager.set(this._cacheKey, value, this._options.ttl);
    }

    public async get(): Promise<T | null> {
        return this._cacheManager.get<T>(this._cacheKey);
    }

    public async del(): Promise<void> {
        return this._cacheManager.del(this._cacheKey);
    }

    public async flush(): Promise<void> {
        return this._cacheManager.reset();
    }
}