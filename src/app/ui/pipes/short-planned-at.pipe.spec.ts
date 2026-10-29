import { TestBed } from '@angular/core/testing';
import { ShortPlannedAtPipe } from './short-planned-at.pipe';
import { ShortTimeHtmlPipe } from './short-time-html.pipe';
import { DateService } from '../../core/date/date.service';
import { DateTimeFormatService } from '../../core/date-time-format/date-time-format.service';
import { DateTimeLocales } from '../../core/locale.constants';
import { getDbDateStr } from '../../util/get-db-date-str';

describe('ShortPlannedAtPipe', () => {
  const TODAY = '2026-10-29';
  let pipe: ShortPlannedAtPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShortPlannedAtPipe,
        { provide: ShortTimeHtmlPipe, useValue: { transform: () => 'TIME' } },
        {
          provide: DateTimeFormatService,
          useValue: { currentLocale: () => DateTimeLocales.en_us },
        },
        {
          provide: DateService,
          useValue: {
            isToday: (ts: number) => getDbDateStr(new Date(ts)) === TODAY,
            todayStr: (date?: Date | number) => (date ? getDbDateStr(date) : TODAY),
          },
        },
      ],
    });
    pipe = TestBed.inject(ShortPlannedAtPipe);
  });

  it('returns null for a value that is not a timestamp', () => {
    expect(pipe.transform(undefined)).toBeNull();
    expect(pipe.transform(null)).toBeNull();
  });

  it('shows only the time for today, or when asked for the time only', () => {
    expect(pipe.transform(new Date(2026, 9, 29, 10, 0).getTime())).toBe('TIME');
    expect(pipe.transform(new Date(2027, 5, 1, 10, 0).getTime(), true)).toBe('TIME');
  });

  it('shows month and day for another day in the current year', () => {
    expect(pipe.transform(new Date(2026, 11, 20, 10, 0).getTime())).toBe('12/20');
    // late evening on the last day of the year still counts as this year
    expect(pipe.transform(new Date(2026, 11, 31, 23, 30).getTime())).toBe('12/31');
  });

  it('adds the year for a day in another year (#10804)', () => {
    expect(pipe.transform(new Date(2027, 5, 1, 10, 0).getTime())).toBe('6/1/27');
    expect(pipe.transform(new Date(2025, 11, 31, 10, 0).getTime())).toBe('12/31/25');
  });
});
