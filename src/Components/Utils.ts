export class Arrays {
    public static isNullOrEmpty(array: any[]) {
        return array === null || array === undefined || array.length === 0;
    }

    public static getUniqueValues<T>(...arrays: T[][]): T[] {
        var result = [];

        if (!arrays || !arrays.length) {
            return result;
        }

        for (let i = 0; i < arrays.length; i++) {
            var currentArray = arrays[i];
            var newElems = currentArray.filter((a) => result.every(r => r !== a));
            result = result.concat(newElems);
        }

        return result;
    }

    public static contains<T>(array: T[], value: T): boolean {
        return array.indexOf(value) >= 0;
    }

    public static arraysAreEqual<T>(array1: T[], array2: T[]): boolean {
        if (array1 === array2) {
            return true;
        }

        if ((!array1 || !array2) || array1.length !== array2.length) {
            return false;
        }

        for (var i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }
}

export class ObjectComparer {
    public static arraysDiffer(a: any[], b: any[]) {
        if (a == null || b == null) {
            return a == null && b == null;
        }

        return a.length !== b.length || a.some((item, index) => !ObjectComparer.isSame(item, b[index]));
    }

    public static objectsDiffer(a: Object, b: Object) {
        var aProperties = Object.keys(a);
        var bProperties = Object.keys(b);

        return aProperties.length !== bProperties.length || aProperties.some(key => !ObjectComparer.isSame(a[key], b[key]));
    }

    public static isSame(a: any, b: any) {
        if (a == null || b == null) {
            return a == null && b == null;
        }

        if (typeof a !== typeof b) {
            return false;
        }

        // otherwise comparison as object always returned false
        if (typeof a === 'function') {
            return true;
        }

        if (Array.isArray(a)) {
            return !this.arraysDiffer(a, b);
        }

        // if (a instanceof Date && b instanceof Date) {
        //     return a - b === 0;
        // }

        if (typeof a === 'object' && a !== null && b !== null) {
            return !this.objectsDiffer(a, b);
        }

        return a === b;
    }

    /*
     * Source: http://snipplr.com/view/36012/javascript-natural-sort/
     */
    public static stringNaturalSortCompare(as: string, bs: string): number {
        var rx = /(\d+)|(\D+)/g, rd = /\d+/;
        var a = as.toLowerCase().match(rx);
        var b = bs.toLowerCase().match(rx);
        while (a.length && b.length) {
            var a1: any = a.shift();
            var b1: any = b.shift();
            if (rd.test(a1) || rd.test(b1)) {
                if (!rd.test(a1)) return 1;
                if (!rd.test(b1)) return -1;
                if (a1 !== b1) return a1 - b1;
            }
            else if (a1 !== b1) return a1 > b1 ? 1 : -1;
        }
        return a.length - b.length;
    }
}

export class Guid {
    private static next: number = 0;

    public static getNext(): string {
        this.next++;
        return "__GUID_" + (this.next + 1000);
    }
}