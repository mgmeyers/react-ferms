// TODO: this is temporary

declare module 'react-hooks-testing-library' {
  import { BoundFunction, queries } from 'dom-testing-library'

  export * from 'dom-testing-library'

  type Query = (
    container: HTMLElement,
    ...args: any[]
  ) => HTMLElement[] | HTMLElement | null

  interface Queries {
    [T: string]: Query
  }

  export type RenderResult<Q extends Queries = typeof queries> = {
    container: HTMLElement
    baseElement: HTMLElement
    debug: (baseElement?: HTMLElement | DocumentFragment) => void
    rerender: (ui: React.ReactElement<any>) => void
    unmount: () => boolean
    asFragment: () => DocumentFragment
  } & { [P in keyof Q]: BoundFunction<Q[P]> }

  export interface RenderOptions<Q extends Queries = typeof queries> {
    container?: HTMLElement
    baseElement?: HTMLElement
    hydrate?: boolean
    queries?: Q
    wrapper?: React.ComponentType
  }

  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

  /**
   * Render into a container which is appended to document.body. It should be used with cleanup.
   */
  export function render(
    ui: React.ReactElement<any>,
    options?: Omit<RenderOptions, 'queries'>
  ): RenderResult

  export function render<Q extends Queries>(
    ui: React.ReactElement<any>,
    options: RenderOptions<Q>
  ): RenderResult<Q>

  /**
   * Unmounts React trees that were mounted with render.
   */
  export function cleanup(): void

  /**
   * Simply calls ReactDOMTestUtils.act(cb)
   * If that's not available (older version of react) then it
   * simply calls the given callback immediately
   */
  export function act(callback: () => void): void

  export type HookOptions = RenderOptions

  export interface HookResult<TResult> {
    result: React.MutableRefObject<TResult>
    rerender: (v?: any) => void
    unmount: () => boolean
  }

  /**
   * Renders a test component that calls back to the test.
   */
  export function renderHook<T>(
    callback: (v: any) => T,
    options?: Partial<HookOptions> & { initialProps: any }
  ): HookResult<T>
}