import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { LocalDateStrPipe } from './local-date-str.pipe';
import { DateTimeFormatService } from '../../core/date-time-format/date-time-format.service';
import { DateTimeLocales } from '../../core/locale.constants';

describe('LocalDateStrPipe', () => {
  let pipe: LocalDateStrPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalDateStrPipe,
        {
          provide: DateTimeFormatService,
          useValue: { currentLocale: () => DateTimeLocales.en_us },
        },
        { provide: TranslateService, useValue: { instant: () => 'Today' } },
      ],
    });
    pipe = TestBed.inject(LocalDateStrPipe);
  });

  it('returns null for a value that is not a date string', () => {
    expect(pipe.transform(undefined)).toBeNull();
    expect(pipe.transform('not-a-date')).toBeNull();
  });

  it('shows "Today" for today', () => {
    expect(pipe.transform('2026-10-28', '2026-10-28')).toBe('Today');
  });

  it('shows only month and day within the current year', () => {
    expect(pipe.transform('2026-12-20', '2026-10-28')).toBe('12/20');
  });

  it('adds a 2-digit year outside the current year (#10804)', () => {
    expect(pipe.transform('2027-06-01', '2026-10-28')).toBe('6/1/27');
    expect(pipe.transform('2025-12-31', '2026-10-28')).toBe('12/31/25');
  });

  it('uses the real current year when no today string is given', () => {
    const thisYear = new Date().getFullYear();
    expect(pipe.transform(`${thisYear}-12-20`, '')).toBe('12/20');
    expect(pipe.transform(`${thisYear + 1}-06-01`, '')).toBe(
      `6/1/${String(thisYear + 1).slice(2)}`,
    );
  });
});
