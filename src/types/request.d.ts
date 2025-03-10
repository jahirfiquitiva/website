export interface RequestContext<
  T extends Record<string, unknown> | undefined = undefined,
> {
  params: Promise<T>;
}
