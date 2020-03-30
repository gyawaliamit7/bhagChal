export class Path {
     x: number;
     y: number;
     connectors: Path[];
     isTiger: boolean;
     isDeer: boolean;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.connectors = [];
        this.isTiger = false;
        this.isDeer = false;
    }

    set_x(x: number) {
        this.x = x;
    }

    set_y(y: number) {
        this.y = y;
    }

    get_x(): number {
        return this.x;
    }

    set_tiger(flag: boolean) {
        this.isTiger = flag;

    }

    set_deer(flag: boolean) {
        this.isDeer = flag;

    }
    is_tiger(): boolean {
        return this.isTiger;
    }
    is_deer(): boolean {
        return this.isDeer;
    }

    get_y(): number {
        return this.y;
    }

    set_connector(path: Path) {
        this.connectors.push(path);
    }

    get_connector(): Path[] {
        return this.connectors;
    }
}
