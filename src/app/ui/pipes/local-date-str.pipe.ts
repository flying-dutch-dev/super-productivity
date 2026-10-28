import { inject, Pipe, PipeTransform } from '@angular/core';
import { dateStrToUtcDate } from '../../util/date-str-to-utc-date';
import { TranslateService } from '@ngx-translate/core';
import { T } from 'src/app/t.const';
import { getDbDateStr, isDBDateStr } from '../../util/get-db-date-str';
import {
  formatMonthDay,
  formatMonthDayShortYear,
} from '../../util/format-month-day.util';
import { DateTimeFormatService } from '../../core/date-time-format/date-time-format.service';

@Pipe({
  name: 'localDateStr',
  standalone: true,
})
export class LocalDateStrPipe implements PipeTransform {
  private _dateTimeFormatService = inject(DateTimeFormatService);
  private translateService = inject(TranslateService);

  transform(
    value: string | null | undefined,
    todayStr: string = getDbDateStr(),
  ): string | null {
    if (typeof value !== 'string' || !isDBDateStr(value)) {
      return null;
    }
    if (value === todayStr) {
      const translation = this.translateService.instant(T.G.TODAY_TAG_TITLE);
      if (translation.length <= 7) {
        return translation;
      }
    }

    const d = dateStrToUtcDate(value);
    // Use the configured locale if available, otherwise fall back to default
    const locale = this._dateTimeFormatService.currentLocale();
    // Dates outside the current year get a 2-digit year, so tasks due next
    // year don't look like this year's (#10804). Callers may pass '' as todayStr.
    const currentYear = isDBDateStr(todayStr)
      ? todayStr.slice(0, 4)
      : getDbDateStr().slice(0, 4);
    return value.slice(0, 4) === currentYear
      ? formatMonthDay(d, locale)
      : formatMonthDayShortYear(d, locale);
  }
}
