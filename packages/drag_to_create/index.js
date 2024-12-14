import 'preact/jsx-dev-runtime';

const definePlugin = (name, definition) => {
    definition.name = name;
    return definition;
};

const DateFormats = {
    DATE_STRING: /^\d{4}-\d{2}-\d{2}$/,
    TIME_STRING: /^\d{2}:\d{2}$/,
    DATE_TIME_STRING: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
};

class InvalidDateTimeError extends Error {
    constructor(dateTimeSpecification) {
        super(`Invalid date time specification: ${dateTimeSpecification}`);
    }
}

const toJSDate = (dateTimeSpecification) => {
    if (!DateFormats.DATE_TIME_STRING.test(dateTimeSpecification) &&
        !DateFormats.DATE_STRING.test(dateTimeSpecification))
        throw new InvalidDateTimeError(dateTimeSpecification);
    return new Date(Number(dateTimeSpecification.slice(0, 4)), Number(dateTimeSpecification.slice(5, 7)) - 1, Number(dateTimeSpecification.slice(8, 10)), Number(dateTimeSpecification.slice(11, 13)), // for date strings this will be 0
    Number(dateTimeSpecification.slice(14, 16)) // for date strings this will be 0
    );
};
const toIntegers = (dateTimeSpecification) => {
    const hours = dateTimeSpecification.slice(11, 13), minutes = dateTimeSpecification.slice(14, 16);
    return {
        year: Number(dateTimeSpecification.slice(0, 4)),
        month: Number(dateTimeSpecification.slice(5, 7)) - 1,
        date: Number(dateTimeSpecification.slice(8, 10)),
        hours: hours !== '' ? Number(hours) : undefined,
        minutes: minutes !== '' ? Number(minutes) : undefined,
    };
};

class NumberRangeError extends Error {
    constructor(min, max) {
        super(`Number must be between ${min} and ${max}.`);
        Object.defineProperty(this, "min", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: min
        });
        Object.defineProperty(this, "max", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: max
        });
    }
}

const doubleDigit$1 = (number) => {
    if (number < 0 || number > 99)
        throw new NumberRangeError(0, 99);
    return String(number).padStart(2, '0');
};

const toDateString = (date) => {
    return `${date.getFullYear()}-${doubleDigit$1(date.getMonth() + 1)}-${doubleDigit$1(date.getDate())}`;
};
const toTimeString = (date) => {
    return `${doubleDigit$1(date.getHours())}:${doubleDigit$1(date.getMinutes())}`;
};
const toDateTimeString = (date) => {
    return `${toDateString(date)} ${toTimeString(date)}`;
};

var WeekDay;
(function (WeekDay) {
    WeekDay[WeekDay["SUNDAY"] = 0] = "SUNDAY";
    WeekDay[WeekDay["MONDAY"] = 1] = "MONDAY";
    WeekDay[WeekDay["TUESDAY"] = 2] = "TUESDAY";
    WeekDay[WeekDay["WEDNESDAY"] = 3] = "WEDNESDAY";
    WeekDay[WeekDay["THURSDAY"] = 4] = "THURSDAY";
    WeekDay[WeekDay["FRIDAY"] = 5] = "FRIDAY";
    WeekDay[WeekDay["SATURDAY"] = 6] = "SATURDAY";
})(WeekDay || (WeekDay = {}));

WeekDay.MONDAY;
const addMinutes = (to, nMinutes) => {
    const { year, month, date, hours, minutes } = toIntegers(to);
    const isDateTimeString = hours !== undefined && minutes !== undefined;
    const jsDate = new Date(year, month, date, hours !== null && hours !== void 0 ? hours : 0, minutes !== null && minutes !== void 0 ? minutes : 0);
    jsDate.setMinutes(jsDate.getMinutes() + nMinutes);
    if (isDateTimeString) {
        return toDateTimeString(jsDate);
    }
    return toDateString(jsDate);
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const minuteTimePointMultiplier = 1.6666666666666667; // 100 / 60
const doubleDigit = (number) => {
    return String(number).padStart(2, '0');
};
const timeStringFromTimePoints = (timePoints) => {
    const hours = Math.floor(timePoints / 100);
    const minutes = Math.round((timePoints % 100) / minuteTimePointMultiplier);
    return `${doubleDigit(hours)}:${doubleDigit(minutes)}`;
};
const addTimePointsToDateTime = (dateTimeString, pointsToAdd) => {
    const minutesToAdd = pointsToAdd / minuteTimePointMultiplier;
    const jsDate = toJSDate(dateTimeString);
    jsDate.setMinutes(jsDate.getMinutes() + minutesToAdd);
    return toDateTimeString(jsDate);
};

const EVENTS_SERVICE_WARNING = 'EventServicePlugin is not available. When using DragToCreatePlugin, make sure to add EventServicePlugin to the calendar configuration.';
const UNSUPPORTED_VIEW_WARNING = 'Drag to create is not supported in the month-agenda view';

const roundDateTime = (dateTime, acceptedMinutes) => {
    const [date, time] = dateTime.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    const roundedMinute = Math.max(...acceptedMinutes.filter((m) => m <= minute));
    const roundedTime = `${String(hour).padStart(2, '0')}:${String(roundedMinute).padStart(2, '0')}`;
    return `${date} ${roundedTime}`;
};

var _DayAndWeekViewDragHandler_instances, _DayAndWeekViewDragHandler_findAllDisturbingElements, _DayAndWeekViewDragHandler_setupListeners, _DayAndWeekViewDragHandler_handleDragEnterTimeGridDay, _DayAndWeekViewDragHandler_handleDragLeaveTimeGridDay, _DayAndWeekViewDragHandler_handleDragOver, _DayAndWeekViewDragHandler_handleDropOnTimeGridDay, _DayAndWeekViewDragHandler_handleEnterDateGridDay, _DayAndWeekViewDragHandler_handleLeaveDateGridDay, _DayAndWeekViewDragHandler_getDateGridDayFromDragEvent, _DayAndWeekViewDragHandler_handleDropOnDateGridDay, _DayAndWeekViewDragHandler_handleDropOnWeekGridDate, _DayAndWeekViewDragHandler_createNewDateGridEvent, _DayAndWeekViewDragHandler_timePointsPerPixel, _DayAndWeekViewDragHandler_removeAllListeners, _DayAndWeekViewDragHandler_disablePointerEventsForDisturbingElements, _DayAndWeekViewDragHandler_enablePointerEventsForDisturbingElements;
class DayAndWeekViewDragHandler {
    constructor($app, config, eventId, otherEventProperties = {}) {
        _DayAndWeekViewDragHandler_instances.add(this);
        Object.defineProperty(this, "$app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: $app
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config
        });
        Object.defineProperty(this, "eventId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: eventId
        });
        Object.defineProperty(this, "otherEventProperties", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: otherEventProperties
        });
        Object.defineProperty(this, "timeGridDays", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dateGridDays", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "weekGridDates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "disturbingElements", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        _DayAndWeekViewDragHandler_handleDragEnterTimeGridDay.set(this, (dragEvent) => {
            dragEvent.preventDefault();
            const timeGridDay = dragEvent.currentTarget;
            timeGridDay.classList.add('sx__drag-over');
        });
        _DayAndWeekViewDragHandler_handleDragLeaveTimeGridDay.set(this, (dragEvent) => {
            dragEvent.preventDefault();
            const timeGridDay = dragEvent.currentTarget;
            timeGridDay.classList.remove('sx__drag-over');
        });
        _DayAndWeekViewDragHandler_handleDragOver.set(this, (dragEvent) => {
            dragEvent.preventDefault();
        });
        _DayAndWeekViewDragHandler_handleDropOnTimeGridDay.set(this, (dragEvent) => {
            const timeGridDay = dragEvent.currentTarget;
            timeGridDay.classList.remove('sx__drag-over');
            const eventsServicePlugin = this.$app.config.plugins
                .eventsService;
            if (!eventsServicePlugin) {
                console.error('EventServicePlugin is not available. When using DragToCreatePlugin, make sure to add EventServicePlugin to the calendar configuration.');
                return;
            }
            const targetDate = timeGridDay.dataset.timeGridDate;
            const offsetY = dragEvent.offsetY;
            const dropPointInTimePoints = offsetY * __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_timePointsPerPixel, "f").call(this);
            const timeInDay = timeStringFromTimePoints(dropPointInTimePoints);
            const dateTime = `${targetDate} ${timeInDay}`;
            const dateTimeAdjustedForDayBoundary = addTimePointsToDateTime(dateTime, this.$app.config.dayBoundaries.value.start);
            const roundedDateTime = roundDateTime(dateTimeAdjustedForDayBoundary, [0, 30]);
            const newEvent = {
                ...this.otherEventProperties,
                id: this.eventId,
                start: roundedDateTime,
                end: addMinutes(roundedDateTime, 60),
            };
            /**
             * Remove all listeners before adding the event. This is important to avoid memory leaks
             * for users who remove the element that initiated the drag event, since they might otherwise remove that element
             * before the dragend event is triggered.
             * */
            __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_removeAllListeners, "f").call(this);
            eventsServicePlugin.add(newEvent);
            if (this.config.onAddEvent) {
                this.config.onAddEvent(newEvent);
            }
        });
        _DayAndWeekViewDragHandler_handleEnterDateGridDay.set(this, (dragEvent) => {
            dragEvent.preventDefault();
            const dateGridDay = __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_getDateGridDayFromDragEvent, "f").call(this, dragEvent);
            dateGridDay === null || dateGridDay === void 0 ? void 0 : dateGridDay.classList.add('sx__drag-over');
        });
        _DayAndWeekViewDragHandler_handleLeaveDateGridDay.set(this, (dragEvent) => {
            dragEvent.preventDefault();
            const dateGridDay = __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_getDateGridDayFromDragEvent, "f").call(this, dragEvent);
            dateGridDay === null || dateGridDay === void 0 ? void 0 : dateGridDay.classList.remove('sx__drag-over');
        });
        _DayAndWeekViewDragHandler_getDateGridDayFromDragEvent.set(this, (dragEvent) => {
            let dateGridDay = null;
            const targetElement = dragEvent.currentTarget;
            if (!(targetElement instanceof HTMLElement)) {
                console.warn('Tried dragging over a date grid day, but targetElement is not an instance of HTMLElement');
                return;
            }
            dateGridDay = targetElement.closest('.sx__date-grid-day');
            if (!dateGridDay) {
                console.warn('Tried dragging over a date grid day, but dateGridDay is not an instance of HTMLElement');
                return;
            }
            return dateGridDay;
        });
        _DayAndWeekViewDragHandler_handleDropOnDateGridDay.set(this, (dragEvent) => {
            const dateGridDay = __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_getDateGridDayFromDragEvent, "f").call(this, dragEvent);
            if (!(dateGridDay instanceof HTMLElement)) {
                console.error('Tried dropping on a date grid day, but dateGridDay is not an instance of HTMLElement');
                return;
            }
            dateGridDay === null || dateGridDay === void 0 ? void 0 : dateGridDay.classList.remove('sx__drag-over');
            const targetDate = dateGridDay.dataset.dateGridDate;
            if (!targetDate) {
                console.error('Tried dropping on a date grid day, but data-date-grid-date is not available');
                return;
            }
            __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_instances, "m", _DayAndWeekViewDragHandler_createNewDateGridEvent).call(this, targetDate);
        });
        _DayAndWeekViewDragHandler_handleDropOnWeekGridDate.set(this, (dragEvent) => {
            const targetEl = dragEvent.currentTarget;
            const weekGridDate = targetEl.closest('.sx__week-grid__date');
            if (!(weekGridDate instanceof HTMLElement) || !weekGridDate.dataset.date) {
                console.error('Tried dropping on a week grid date, but weekGridDate is not an instance of HTMLElement or does not have a data-date attribute');
                return;
            }
            const targetDate = weekGridDate.dataset.date;
            __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_instances, "m", _DayAndWeekViewDragHandler_createNewDateGridEvent).call(this, targetDate);
        });
        _DayAndWeekViewDragHandler_timePointsPerPixel.set(this, () => {
            return (this.$app.config.timePointsPerDay /
                this.$app.config.weekOptions.value.gridHeight);
        });
        _DayAndWeekViewDragHandler_removeAllListeners.set(this, () => {
            var _a, _b, _c;
            (_a = this.timeGridDays) === null || _a === void 0 ? void 0 : _a.forEach((timeGridDay) => {
                if (!(timeGridDay instanceof HTMLElement))
                    return;
                timeGridDay.removeEventListener('dragenter', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragEnterTimeGridDay, "f"));
                timeGridDay.removeEventListener('dragleave', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragLeaveTimeGridDay, "f"));
                timeGridDay.removeEventListener('dragover', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragOver, "f"));
                timeGridDay.removeEventListener('drop', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDropOnTimeGridDay, "f"));
            });
            (_b = this.dateGridDays) === null || _b === void 0 ? void 0 : _b.forEach((dateGridDay) => {
                if (!(dateGridDay instanceof HTMLElement))
                    return;
                dateGridDay.removeEventListener('dragenter', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleEnterDateGridDay, "f"));
                dateGridDay.removeEventListener('dragleave', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleLeaveDateGridDay, "f"));
                dateGridDay.removeEventListener('dragover', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragOver, "f"));
                dateGridDay.removeEventListener('drop', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDropOnDateGridDay, "f"));
            });
            (_c = this.weekGridDates) === null || _c === void 0 ? void 0 : _c.forEach((weekGridDate) => {
                if (!(weekGridDate instanceof HTMLElement))
                    return;
                weekGridDate.removeEventListener('dragover', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragOver, "f"));
                weekGridDate.removeEventListener('drop', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDropOnWeekGridDate, "f"));
            });
            __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_enablePointerEventsForDisturbingElements, "f").call(this);
        }
        /**
         * Pointer events on the event elements are disabled since they are blocking pointer events for
         * the time grid days and date grid days.
         * */
        );
        /**
         * Pointer events on the event elements are disabled since they are blocking pointer events for
         * the time grid days and date grid days.
         * */
        _DayAndWeekViewDragHandler_disablePointerEventsForDisturbingElements.set(this, () => {
            var _a;
            (_a = this.disturbingElements) === null || _a === void 0 ? void 0 : _a.forEach((timeGridDay) => {
                if (!(timeGridDay instanceof HTMLElement))
                    return;
                timeGridDay.style.pointerEvents = 'none';
            });
        });
        _DayAndWeekViewDragHandler_enablePointerEventsForDisturbingElements.set(this, () => {
            var _a;
            (_a = this.disturbingElements) === null || _a === void 0 ? void 0 : _a.forEach((timeGridDay) => {
                if (!(timeGridDay instanceof HTMLElement))
                    return;
                timeGridDay.style.pointerEvents = 'auto';
            });
        });
        document.addEventListener('dragend', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_removeAllListeners, "f"), {
            once: true,
        });
        __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_instances, "m", _DayAndWeekViewDragHandler_findAllDisturbingElements).call(this);
        __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_disablePointerEventsForDisturbingElements, "f").call(this);
        __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_instances, "m", _DayAndWeekViewDragHandler_setupListeners).call(this);
    }
}
_DayAndWeekViewDragHandler_handleDragEnterTimeGridDay = new WeakMap(), _DayAndWeekViewDragHandler_handleDragLeaveTimeGridDay = new WeakMap(), _DayAndWeekViewDragHandler_handleDragOver = new WeakMap(), _DayAndWeekViewDragHandler_handleDropOnTimeGridDay = new WeakMap(), _DayAndWeekViewDragHandler_handleEnterDateGridDay = new WeakMap(), _DayAndWeekViewDragHandler_handleLeaveDateGridDay = new WeakMap(), _DayAndWeekViewDragHandler_getDateGridDayFromDragEvent = new WeakMap(), _DayAndWeekViewDragHandler_handleDropOnDateGridDay = new WeakMap(), _DayAndWeekViewDragHandler_handleDropOnWeekGridDate = new WeakMap(), _DayAndWeekViewDragHandler_timePointsPerPixel = new WeakMap(), _DayAndWeekViewDragHandler_removeAllListeners = new WeakMap(), _DayAndWeekViewDragHandler_disablePointerEventsForDisturbingElements = new WeakMap(), _DayAndWeekViewDragHandler_enablePointerEventsForDisturbingElements = new WeakMap(), _DayAndWeekViewDragHandler_instances = new WeakSet(), _DayAndWeekViewDragHandler_findAllDisturbingElements = function _DayAndWeekViewDragHandler_findAllDisturbingElements() {
    var _a, _b;
    const allEventElements = (_a = this.$app.elements.calendarWrapper) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.sx__event');
    if (allEventElements) {
        this.disturbingElements = Array.from(allEventElements);
    }
    const allDateGridCells = (_b = this.$app.elements.calendarWrapper) === null || _b === void 0 ? void 0 : _b.querySelectorAll('.sx__date-grid-cell');
    if (allDateGridCells) {
        this.disturbingElements = this.disturbingElements.concat(Array.from(allDateGridCells));
    }
}, _DayAndWeekViewDragHandler_setupListeners = function _DayAndWeekViewDragHandler_setupListeners() {
    var _a, _b, _c, _d, _e, _f;
    this.timeGridDays =
        (_a = this.$app.elements.calendarWrapper) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.sx__time-grid-day');
    this.dateGridDays =
        (_b = this.$app.elements.calendarWrapper) === null || _b === void 0 ? void 0 : _b.querySelectorAll('.sx__date-grid-day');
    this.weekGridDates = (_c = this.$app.elements.calendarWrapper) === null || _c === void 0 ? void 0 : _c.querySelectorAll('.sx__week-grid__date');
    (_d = this.timeGridDays) === null || _d === void 0 ? void 0 : _d.forEach((timeGridDay) => {
        if (!(timeGridDay instanceof HTMLElement))
            return;
        timeGridDay.addEventListener('dragenter', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragEnterTimeGridDay, "f"));
        timeGridDay.addEventListener('dragleave', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragLeaveTimeGridDay, "f"));
        timeGridDay.addEventListener('dragover', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragOver, "f"));
        timeGridDay.addEventListener('drop', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDropOnTimeGridDay, "f"));
    });
    (_e = this.dateGridDays) === null || _e === void 0 ? void 0 : _e.forEach((dateGridDay) => {
        if (!(dateGridDay instanceof HTMLElement))
            return;
        dateGridDay.addEventListener('dragenter', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleEnterDateGridDay, "f"));
        dateGridDay.addEventListener('dragleave', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleLeaveDateGridDay, "f"));
        dateGridDay.addEventListener('dragover', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragOver, "f"));
        dateGridDay.addEventListener('drop', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDropOnDateGridDay, "f"));
    });
    (_f = this.weekGridDates) === null || _f === void 0 ? void 0 : _f.forEach((weekGridDate) => {
        if (!(weekGridDate instanceof HTMLElement))
            return;
        weekGridDate.addEventListener('dragover', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDragOver, "f"));
        weekGridDate.addEventListener('drop', __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_handleDropOnWeekGridDate, "f"));
    });
}, _DayAndWeekViewDragHandler_createNewDateGridEvent = function _DayAndWeekViewDragHandler_createNewDateGridEvent(targetDate) {
    const eventsServicePlugin = this.$app.config.plugins
        .eventsService;
    if (!eventsServicePlugin) {
        console.error(EVENTS_SERVICE_WARNING);
        return;
    }
    const newEvent = {
        ...this.otherEventProperties,
        id: this.eventId,
        start: targetDate,
        end: targetDate,
    };
    /**
     * Remove all listeners before adding the event. This is important to avoid memory leaks
     * for users who remove the element that initiated the drag event, since they might otherwise remove that element
     * before the dragend event is triggered.
     * */
    __classPrivateFieldGet(this, _DayAndWeekViewDragHandler_removeAllListeners, "f").call(this);
    eventsServicePlugin.add(newEvent);
    if (this.config.onAddEvent) {
        this.config.onAddEvent(newEvent);
    }
};

var _MonthViewDragHandler_instances, _MonthViewDragHandler_setupListeners, _MonthViewDragHandler_handleDragEnterMonthGridDay, _MonthViewDragHandler_handleDragLeaveMonthGridDay, _MonthViewDragHandler_handleDragOver, _MonthViewDragHandler_handleDropOnMonthGridDay, _MonthViewDragHandler_getMonthGridDayFromDragEvent, _MonthViewDragHandler_removeAllListeners, _MonthViewDragHandler_findAllDisturbingElements, _MonthViewDragHandler_disablePointerEventsForDisturbingElements, _MonthViewDragHandler_enablePointerEventsForDisturbingElements;
class MonthViewDragHandler {
    constructor($app, config, eventId, otherEventProperties = {}) {
        _MonthViewDragHandler_instances.add(this);
        Object.defineProperty(this, "$app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: $app
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config
        });
        Object.defineProperty(this, "eventId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: eventId
        });
        Object.defineProperty(this, "otherEventProperties", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: otherEventProperties
        });
        Object.defineProperty(this, "monthGridDays", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "disturbingElements", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        _MonthViewDragHandler_handleDragEnterMonthGridDay.set(this, (dragEvent) => {
            dragEvent.preventDefault();
            const target = __classPrivateFieldGet(this, _MonthViewDragHandler_getMonthGridDayFromDragEvent, "f").call(this, dragEvent);
            if (!target)
                return;
            target.classList.add('sx__drag-over');
        });
        _MonthViewDragHandler_handleDragLeaveMonthGridDay.set(this, (dragEvent) => {
            dragEvent.preventDefault();
            const target = __classPrivateFieldGet(this, _MonthViewDragHandler_getMonthGridDayFromDragEvent, "f").call(this, dragEvent);
            if (!target)
                return;
            target.classList.remove('sx__drag-over');
        });
        _MonthViewDragHandler_handleDragOver.set(this, (dragEvent) => {
            dragEvent.preventDefault();
        });
        _MonthViewDragHandler_handleDropOnMonthGridDay.set(this, (dragEvent) => {
            const target = __classPrivateFieldGet(this, _MonthViewDragHandler_getMonthGridDayFromDragEvent, "f").call(this, dragEvent);
            if (!target) {
                console.error('Tried to get a month grid day from a drop event, but none was found.');
                return;
            }
            target.classList.remove('sx__drag-over');
            const date = target.dataset.date;
            if (!date) {
                console.error('Tried to get a date from a month grid day, but none was found.');
                return;
            }
            const eventsServicePlugin = this.$app.config.plugins
                .eventsService;
            if (!eventsServicePlugin) {
                console.error(EVENTS_SERVICE_WARNING);
                return;
            }
            /**
             * Remove all listeners before adding the event. This is important to avoid memory leaks
             * for users who remove the element that initiated the drag event, since they might otherwise remove that element
             * before the dragend event is triggered.
             * */
            __classPrivateFieldGet(this, _MonthViewDragHandler_removeAllListeners, "f").call(this);
            const eventToAdd = {
                id: this.eventId,
                start: date,
                end: date,
                ...this.otherEventProperties,
            };
            eventsServicePlugin.add(eventToAdd);
            if (this.config.onAddEvent) {
                this.config.onAddEvent(eventToAdd);
            }
        });
        _MonthViewDragHandler_getMonthGridDayFromDragEvent.set(this, (dragEvent) => {
            const target = dragEvent.target;
            const closest = target.closest('.sx__month-grid-day');
            if (!(closest instanceof HTMLElement)) {
                console.error('Tried to find an element with class sx__month-grid-day for drag event, but none was found.');
                return null;
            }
            return closest;
        });
        _MonthViewDragHandler_removeAllListeners.set(this, () => {
            var _a;
            __classPrivateFieldGet(this, _MonthViewDragHandler_enablePointerEventsForDisturbingElements, "f").call(this);
            (_a = this.monthGridDays) === null || _a === void 0 ? void 0 : _a.forEach((monthGridDay) => {
                if (!(monthGridDay instanceof HTMLElement))
                    return;
                monthGridDay.removeEventListener('dragenter', __classPrivateFieldGet(this, _MonthViewDragHandler_handleDragEnterMonthGridDay, "f"));
                monthGridDay.removeEventListener('dragleave', __classPrivateFieldGet(this, _MonthViewDragHandler_handleDragLeaveMonthGridDay, "f"));
                monthGridDay.removeEventListener('dragover', __classPrivateFieldGet(this, _MonthViewDragHandler_handleDragOver, "f"));
                monthGridDay.removeEventListener('drop', __classPrivateFieldGet(this, _MonthViewDragHandler_handleDropOnMonthGridDay, "f"));
            });
        });
        _MonthViewDragHandler_findAllDisturbingElements.set(this, () => {
            var _a;
            this.disturbingElements = Array.from(document.querySelectorAll('.sx__month-grid-day__header'));
            const allEvents = (_a = this.$app.elements.calendarWrapper) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.sx__month-grid-day__events');
            if (allEvents) {
                this.disturbingElements = this.disturbingElements.concat(Array.from(allEvents));
            }
        });
        _MonthViewDragHandler_disablePointerEventsForDisturbingElements.set(this, () => {
            this.disturbingElements.forEach((element) => {
                if (!(element instanceof HTMLElement))
                    return;
                element.style.pointerEvents = 'none';
            });
        });
        _MonthViewDragHandler_enablePointerEventsForDisturbingElements.set(this, () => {
            this.disturbingElements.forEach((element) => {
                if (!(element instanceof HTMLElement))
                    return;
                element.style.pointerEvents = 'auto';
            });
        });
        document.addEventListener('dragend', __classPrivateFieldGet(this, _MonthViewDragHandler_removeAllListeners, "f"));
        __classPrivateFieldGet(this, _MonthViewDragHandler_findAllDisturbingElements, "f").call(this);
        __classPrivateFieldGet(this, _MonthViewDragHandler_disablePointerEventsForDisturbingElements, "f").call(this);
        __classPrivateFieldGet(this, _MonthViewDragHandler_instances, "m", _MonthViewDragHandler_setupListeners).call(this);
    }
}
_MonthViewDragHandler_handleDragEnterMonthGridDay = new WeakMap(), _MonthViewDragHandler_handleDragLeaveMonthGridDay = new WeakMap(), _MonthViewDragHandler_handleDragOver = new WeakMap(), _MonthViewDragHandler_handleDropOnMonthGridDay = new WeakMap(), _MonthViewDragHandler_getMonthGridDayFromDragEvent = new WeakMap(), _MonthViewDragHandler_removeAllListeners = new WeakMap(), _MonthViewDragHandler_findAllDisturbingElements = new WeakMap(), _MonthViewDragHandler_disablePointerEventsForDisturbingElements = new WeakMap(), _MonthViewDragHandler_enablePointerEventsForDisturbingElements = new WeakMap(), _MonthViewDragHandler_instances = new WeakSet(), _MonthViewDragHandler_setupListeners = function _MonthViewDragHandler_setupListeners() {
    var _a, _b;
    this.monthGridDays = (_a = this.$app.elements.calendarWrapper) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.sx__month-grid-day');
    (_b = this.monthGridDays) === null || _b === void 0 ? void 0 : _b.forEach((monthGridDay) => {
        if (!(monthGridDay instanceof HTMLElement))
            return;
        monthGridDay.addEventListener('dragenter', __classPrivateFieldGet(this, _MonthViewDragHandler_handleDragEnterMonthGridDay, "f"));
        monthGridDay.addEventListener('dragleave', __classPrivateFieldGet(this, _MonthViewDragHandler_handleDragLeaveMonthGridDay, "f"));
        monthGridDay.addEventListener('dragover', __classPrivateFieldGet(this, _MonthViewDragHandler_handleDragOver, "f"));
        monthGridDay.addEventListener('drop', __classPrivateFieldGet(this, _MonthViewDragHandler_handleDropOnMonthGridDay, "f"));
    });
};

class DragToCreatePlugin {
    constructor(config) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'dragToCreate'
        });
        Object.defineProperty(this, "$app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    beforeRender($app) {
        this.$app = $app;
    }
    dragToCreate(eventId, otherEventProperties) {
        const currentViewName = this.$app.calendarState.view.value;
        if (['week', 'day'].includes(currentViewName)) {
            new DayAndWeekViewDragHandler(this.$app, this.config, eventId, otherEventProperties);
            return;
        }
        else if (currentViewName === 'month-grid') {
            new MonthViewDragHandler(this.$app, this.config, eventId, otherEventProperties);
            return;
        }
        console.error(UNSUPPORTED_VIEW_WARNING);
    }
}
const createDragToCreatePlugin = (config = {}) => {
    return definePlugin('dragToCreate', new DragToCreatePlugin(config));
};

export { createDragToCreatePlugin };
