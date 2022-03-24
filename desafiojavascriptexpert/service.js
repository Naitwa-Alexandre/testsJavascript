import { setTimeout } from 'timers/promises';

export default class Service {
    async save(params) {
        await setTimeout(2000)
        return `${params} saved with sucess!`;
    }
}