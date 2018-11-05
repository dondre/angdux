export interface IDictionary<T> {
    add(key: string, value: T);
    containsKey(key: string): boolean;
    count(): number;
    item(key: string): T;
    keys(): string[];
    remove(key: string): T;
    values(): T[];
}


interface IAction {
    type: string
}

export class Dictionary<T> implements IDictionary<T> {
    private _items: { [index: string]: T } = {};
 
    private _count: number = 0;
 
    public containsKey(key: string): boolean {
        return this._items.hasOwnProperty(key);
    }
 
    public count(): number {
        return this._count;
    }
 
    public add(key: string, value: T) {
        if(!this._items.hasOwnProperty(key))
             this._count++;
 
        this._items[key] = value;
    }
 
    public remove(key: string): T {
        var val = this._items[key];
        delete this._items[key];
        this._count--;
        return val;
    }
 
    public item(key: string): T {
        return this._items[key];
    }

    public items():{ [index: string]: T } {
        return this._items;
    }
 
    public keys(): string[] {
        var keySet: string[] = [];
 
        for (var prop in this._items) {
            if (this._items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
 
        return keySet;
    }
 
    public values(): T[] {
        var values: T[] = [];
 
        for (var prop in this._items) {
            if (this._items.hasOwnProperty(prop)) {
                values.push(this._items[prop]);
            }
        }
 
        return values;
    }
}
