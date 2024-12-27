export class Node {
    /** @type {Node=} */
    c1;
    /** @type {Node=} */
    c2;
    /** @type {number[]} */
    first;
    /** @type {number[]} */
    last;
    /** @type {boolean} */
    nullable;

    /**
     *
     * @param {*} wrappe
     */
    constructor(wrappe = undefined) {
        this.first = [];
        this.last = [];
        this.nullable = true;
        this.wrapee = wrappe;
    }

    /**
     * @abstract
     */
    calcFirst() {
        throw new Error('Implement this method');
    }
    /**
     * @abstract
     */
    calcLast() {
        throw new Error('Implement this method');
    }
    /**
     * @abstract
     */
    calcNullable() {
        throw new Error('Implement this method');
    }
}

export class Hoja extends Node {
    /**
     *
     * @param {string} val
     * @param {boolean} end
     */
    constructor(val, end = false) {
        super();
        this.pos = 0;
        this.val = val;
        this.end = end;
    }

    /**
     * @override
     */
    calcFirst() {
        this.first = [this.pos];
    }
    /**
     * @override
     */
    calcLast() {
        this.last = [this.pos];
    }
    /**
     * @override
     */
    calcNullable() {
        this.nullable = false;
    }
}

export class Concat extends Node {
    /**
     *
     * @param {Node} c1
     * @param {Node} c2
     */
    constructor(c1, c2) {
        super();
        this.c1 = c1;
        this.c2 = c2;
    }

    /**
     * @override
     */
    calcFirst() {
        this.first = this.c1.nullable
            ? [...this.c1.first, ...this.c2.first]
            : this.c1.first;
    }
    /**
     * @override
     */
    calcLast() {
        this.last = this.c2.nullable
            ? [...this.c1.last, ...this.c2.last]
            : this.c2.last;
    }
    /**
     * @override
     */
    calcNullable() {
        this.nullable = this.c1.nullable && this.c2.nullable;
    }
}

export class Or extends Node {
    /**
     *
     * @param {Node} c1
     * @param {Node} c2
     */
    constructor(c1, c2) {
        super();
        this.c1 = c1;
        this.c2 = c2;
    }
    /**
     * @override
     */
    calcFirst() {
        this.first = [...this.c1.first, ...this.c2.last];
    }
    /**
     * @override
     */
    calcLast() {
        this.last = [...this.c1.last, ...this.c2.last];
    }
    /**
     * @override
     */
    calcNullable() {
        this.nullable = this.c1.nullable || this.c2.nullable;
    }
}

export class ZeroOrMore extends Node {
    /**
     *
     * @param {Node} c1
     */
    constructor(c1) {
        super();
        this.c1 = c1;
    }

    /**
     * @override
     */
    calcFirst() {
        this.first = this.c1.first;
    }
    /**
     * @override
     */
    calcLast() {
        this.last = this.c1.last;
    }
    /**
     * @override
     */
    calcNullable() {
        this.nullable = true;
    }
}

export class OneOrMore extends Node {
    /**
     *
     * @param {Node} c1
     */
    constructor(c1) {
        super();
        this.c1 = c1;
    }

    /**
     * @override
     */
    calcFirst() {
        this.first = this.c1.first;
    }
    /**
     * @override
     */
    calcLast() {
        this.last = this.c1.last;
    }
    /**
     * @override
     */
    calcNullable() {
        this.nullable = false;
    }
}

export class Option extends Node {
    /**
     *
     * @param {Node} c1
     */
    constructor(c1) {
        super();
        this.c1 = c1;
    }

    /**
     * @override
     */
    calcFirst() {
        this.first = this.c1.first;
    }
    /**
     * @override
     */
    calcLast() {
        this.last = this.c1.last;
    }
    /**
     * @override
     */
    calcNullable() {
        this.nullable = true;
    }
}
