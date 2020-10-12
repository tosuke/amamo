import { pathToRegexp, Key } from 'path-to-regexp';
import { AppContext } from '@/app/context';

type Params = { [key: string]: string | undefined };

type RouteComponent<Props> = React.ComponentType<{ prepared: Props; params: Params }>;
type PrepareFn<Props> = (ctx: AppContext, params: Params) => Props;

type RouteOptions<Props> = Readonly<{
  prepare: PrepareFn<Props>;
  component: RouteComponent<Props>;
  exact?: boolean;
}>;

function RouteComponent<P>({
  component: Component,
  prepared,
  params,
  children,
}: React.PropsWithChildren<{ component: RouteComponent<P>; prepared: P; params: Params }>) {
  return <Component prepared={prepared} params={params} children={children} />;
}

export class PreparedRoute<Props = any> {
  constructor(private params: Params, private prepared: Props, private component: RouteComponent<Props>) {}

  render(children?: React.ReactNode) {
    return (
      <RouteComponent params={this.params} prepared={this.prepared} component={this.component} children={children} />
    );
  }
}

export class MatchedRoute<Props = any> {
  constructor(private params: Params, private _prepare: PrepareFn<Props>, private compnent: RouteComponent<Props>) {}

  prepare(ctx: AppContext) {
    return new PreparedRoute(this.params, this._prepare(ctx, this.params), this.compnent);
  }
}

export class Route<Props = any> {
  private pathRegexp: RegExp;
  private paramKeys: Key[];

  constructor(pathname: string, private options: RouteOptions<Props>, private chidren: Route[]) {
    this.paramKeys = [];
    this.pathRegexp = pathToRegexp(pathname, this.paramKeys, { end: options.exact ?? false });
  }

  match(path: string): MatchedRoute[] {
    const result = this.pathRegexp.exec(path);
    if (result == null) return [];
    const [matchedPath, ...values] = result;
    if (this.options.exact && matchedPath !== path) return [];

    const params = this.paramKeys.reduce((memo, k, i) => {
      memo[k.name] = values[i];
      return memo;
    }, {} as Params);

    const matchedRoute = new MatchedRoute(params, this.options.prepare, this.options.component);

    const child = this.chidren.reduce((prev, child) => {
      const childResult = child.match(path);
      return childResult.length > prev.length ? childResult : prev;
    }, [] as MatchedRoute[]);

    return [matchedRoute, ...child];
  }
}

export interface RouteBuilder {
  addRoute<Props>(
    pathname: string,
    options: RouteOptions<Props>,
    routes?: (builder: RouteBuilder) => RouteBuilder,
  ): RouteBuilder;
}

export function createRoutes(buildRoutes: (builder: RouteBuilder) => RouteBuilder) {
  class RouteBuilderImpl implements RouteBuilder {
    constructor(public routes: Route[]) {}
    addRoute<P>(
      pathname: string,
      options: RouteOptions<P>,
      routes?: (builder: RouteBuilderImpl) => RouteBuilderImpl,
    ): RouteBuilderImpl {
      const children = routes?.(new RouteBuilderImpl([])).routes ?? [];
      return new RouteBuilderImpl([...this.routes, new Route(pathname, options, children)]);
    }
  }
  const result = buildRoutes(new RouteBuilderImpl([]));
  if (!(result instanceof RouteBuilderImpl)) throw new Error('Do not use custom RouteBuilder');
  return result.routes;
}
