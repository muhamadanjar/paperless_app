class Route<Param extends Record<string, string | number>> {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    withParams(param: Param): string {
        let path = this.path;
        for (const key in param) {
            path = path.replace(`[${key}]`, param[key].toString());
        }
        return path;
    }
}

export class Routes {
    static login = new Route('/auth/login');
    static dashboards = new Route('/overview');
}
