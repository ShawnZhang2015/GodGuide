export default class asyncMini {
    static async eachSeries < T > (
        items: T[] | Iterable < T > ,
        iterator: (item: T, callback: (err ? : Error) => void) => void,
        finalCallback: (err ? : Error) => void
    ): Promise < void > {
        const iterable = Array.isArray(items) ? items : Array.from(items);
        let index = 0;

        const next = (): void => {
            if (index >= iterable.length) {
                finalCallback();
                return;
            }
            
            try {
                const item = iterable[index++];
                iterator(item, (err) => {
                    if (err) {
                        finalCallback(err);
                    } else {
                        next();
                    }
                });
            } catch (error) {
                cc.error(error);
            }
        };

        next();
    }

    static async series(tasks: { [key: string]: (cb:Function)=>void }, callback:(error: Error)=>void){
        const keys = Object.keys(tasks);
        if(!keys.length){
            throw new Error('tasks is empty');
        }
        let index = 0;
        const next = (): void => {
            if (index >= keys.length) {
                callback(undefined);
                return;
            }
            
            try {
                const task = keys[index++];
                tasks[task]((err) => {
                    if (err) {
                        callback(err);
                    } else {
                        next();
                    }
                });
            } catch (error) {
                cc.error(error);
            }
        };
        next();
    }

}