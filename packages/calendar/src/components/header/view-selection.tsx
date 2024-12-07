import { useContext, useState } from 'preact/hooks'
import { AppContext } from '../../utils/stateful/app-context'
import { ViewName } from '@schedule-x/shared/src/types/calendar/view-name'
import { View } from '@schedule-x/shared/src/types/calendar/view'
import { useSignalEffect } from '@preact/signals'

export default function ViewSelection() {
  const $app = useContext(AppContext)

  const [availableViews, setAvailableViews] = useState<View[]>([])

  useSignalEffect(() => {
    if ($app.calendarState.isCalendarSmall.value) {
      setAvailableViews(
        $app.config.views.value.filter((view) => view.hasSmallScreenCompat)
      )
    } else {
      setAvailableViews(
        $app.config.views.value.filter((view) => view.hasWideScreenCompat)
      )
    }
  })

  useSignalEffect(() => {
    const selectedView = $app.config.views.value.find(
      (view) => view.name === $app.calendarState.view.value
    )
    if (!selectedView) return
  })

  const handleClickOnSelectionItem = (viewName: ViewName) => {
    $app.calendarState.setView(
      viewName,
      $app.datePickerState.selectedDate.value
    )
  }

  return (
    <div className="sx__view-selection">
      <div className={'sx__view-selection-tab'}>
        {availableViews.map((view) => (
          <div
            aria-label={
              $app.translate('Select View') + ' ' + $app.translate(view.label)
            }
            tabIndex={-1}
            role="button"
            onClick={() => handleClickOnSelectionItem(view.name)}
            className={`sx__view-selection-tab-item ${view.name === $app.calendarState.view.value && 'sx__view-selection-tab-item-active'}`}
          >
            {$app.translate(view.label)}
          </div>
        ))}
      </div>
    </div>
  )
}
