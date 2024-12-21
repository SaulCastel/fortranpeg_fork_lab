class Node {
    constructor() {
        this.anulable = null;
    }

    /**
     * @returns {number[]}
     */
    primeraPos() {}

    /**
     * @returns {number[]}
     */
    ultimaPos() {}

    /**
     * @returns {boolean}
     */
    anulable() {}
}

export class Hoja extends Node {
    /** @type {number} */
    pos;
    /** @type {string} */
    val;

    /**
     *
     * @param {string} val
     */
    constructor(val) {
        super();
        this.val = val;
    }

    /**
     * @returns {number[]}
     */
    primeraPos() {
        return [this.pos];
    }

    /**
     * @returns {number[]}
     */
    ultimaPos() {
        return [this.pos];
    }

    /**
     * @returns {boolean}
     */
    anulable() {
        return false;
    }
}

export class Concat extends Node {
    c1;
    c2;

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
     * @returns {number[]}
     */
    primeraPos() {
        return this.c1.anulable()
            ? [...this.c1.primeraPos(), ...this.c2.primeraPos()]
            : this.c1.primeraPos();
    }

    /**
     * @returns {number[]}
     */
    ultimaPos() {
        return this.c2.anulable()
            ? [...this.c1.ultimaPos(), ...this.c2.ultimaPos()]
            : this.c2.ultimaPos();
    }

    /**
     * @returns {boolean}
     */
    anulable() {
        return this.c1.anulable() && this.c2.anulable();
    }
}

export class Or extends Node {
    c1;
    c2;

    /**
     *
     * @param {Node} c1
     * @param {Node} c2
     */
    constructor(c1, c2) {
        this.c1 = c1;
        this.c2 = c2;
    }

    /**
     * @returns {number[]}
     */
    primeraPos() {
        return [...this.c1.primeraPos(), ...this.c2.primeraPos()];
    }

    /**
     * @returns {number[]}
     */
    ultimaPos() {
        return [...this.c1.ultimaPos(), ...this.c2.ultimaPos()];
    }

    /**
     * @returns {boolean}
     */
    anulable() {
        return this.c1.anulable() || this.c2.anulable();
    }
}

export class ZeroOrMore extends Node {
    c1;

    /**
     *
     * @param {Node} c1
     */
    constructor(c1) {
        this.c1 = c1;
    }

    /**
     * @returns {number[]}
     */
    primeraPos() {
        return this.c1.primeraPos();
    }

    /**
     * @returns {number[]}
     */
    ultimaPos() {
        return this.c1.ultimaPos();
    }

    /**
     * @returns {boolean}
     */
    anulable() {
        return true;
    }
}

export class OneOrMore extends Node {
    c1;

    /**
     *
     * @param {Node} c1
     */
    constructor(c1) {
        this.c1 = c1;
    }

    /**
     * @returns {number[]}
     */
    primeraPos() {
        return this.c1.primeraPos();
    }

    /**
     * @returns {number[]}
     */
    ultimaPos() {
        return this.c1.ultimaPos();
    }

    /**
     * @returns {boolean}
     */
    anulable() {
        return false;
    }
}

export class Option extends Node {
    c1;

    /**
     *
     * @param {Node} c1
     */
    constructor(c1) {
        this.c1 = c1;
    }

    /**
     * @returns {number[]}
     */
    primeraPos() {
        return this.c1.primeraPos();
    }

    /**
     * @returns {number[]}
     */
    ultimaPos() {
        return this.c1.ultimaPos();
    }

    /**
     * @returns {boolean}
     */
    anulable() {
        return true;
    }
}
