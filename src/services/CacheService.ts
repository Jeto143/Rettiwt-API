// PACKAGE LIBS
import NodeCache from 'node-cache';

// CUSTOM LIBS
import { dataToList, findJSONKey } from './helper/Parser';

/**
 * @summary Handles reading and writing of data from and to cache.
 * 
 * **Note**: To be able to CacheService, the data to be cached must have a unique "id" field.
 */
export class CacheService {
    // MEMBER DATA
    private static instance: CacheService;                              // To store the current instance of this service
    private client: NodeCache;                                          // To store the redis client instance

    // MEMBER METHODS
    private constructor() {
        // Initializing new cache
        this.client = new NodeCache();
    }

    /**
     * @returns The current working instance of CacheService
     */
    static async getInstance(): Promise<CacheService> {
        // If an instance doesnt exists already
        if (!this.instance) {
            this.instance = new CacheService();
            return this.instance;
        }
        // If an instance already exists, returning it
        else {
            return this.instance;
        }
    }

    /**
     * @summary Stores the input data into the cache.
     * @returns Whether writing to cache was successful or not
     * @param data The input data to store
     */
    async write(data: any): Promise<void> {
        // Converting the data to a list of data
        data = dataToList(data);

        // Iterating over the list of data
        for (let item of data) {
            // Storing whether data is already cached or not
            let cached = this.client.has(findJSONKey(item, 'id'));

            // If data does not already exist in cache
            if(!cached) {
                // Adding data to cache
                this.client.set(findJSONKey(item, 'id'), item);
            }
        }
    }

    /**
     * @returns The data with the given id/rest id from cache
     * @param id The id/rest id of the data to be fetched from cache
     */
    async read(id: string): Promise<any> {
        // Getting data from cache
        let res = this.client.get(id);

        return res;
    }
}