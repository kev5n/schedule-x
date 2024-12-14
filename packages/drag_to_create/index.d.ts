import { CalendarEvent, CalendarAppSingleton, PluginBase } from '../calendar'
type PluginConfig = {
  onAddEvent?: (event: CalendarEvent) => void
}
declare class DragToCreatePlugin implements PluginBase<string> {
  private config
  name: string
  $app: CalendarAppSingleton
  constructor(config: PluginConfig)
  beforeRender($app: CalendarAppSingleton): void
  dragToCreate(
    eventId: string | number,
    otherEventProperties?: Omit<CalendarEvent, 'id' | 'start' | 'end'>
  ): void
}
declare const createDragToCreatePlugin: (
  config?: PluginConfig
) => DragToCreatePlugin & {
  name: 'dragToCreate'
}
export { createDragToCreatePlugin, DragToCreatePlugin }
