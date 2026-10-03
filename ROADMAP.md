# Starter tasks

These are proposed tasks, not completed features or filed GitHub issues. Discuss scope with the maintainer before starting.

| Task | Suggested size | Done when |
| --- | --- | --- |
| Keyboard navigation in the calendar | Small | Focus is visible; arrow keys move by day/week, crossing month boundaries; RTL and screen reader behavior are checked. |
| Accessible theme contrast | Small | Light/dark panels, muted labels, selected dates and focus indicators are checked for contrast without changing the overall design. |
| Contributor documentation in Persian | Small | CONTRIBUTING is translated with equivalent commands, privacy guidance and limitations. |
| Background storage error messages | Medium | Quota and unsupported codec failures give useful Persian guidance; the prior saved background remains usable. |
| More recurring-event fixtures | Medium | Synthetic tests cover DST transitions and weekly/monthly recurrence edge cases without real feed URLs. |
| Official Iranian calendar data for the next year | Medium | Dates are verified against an authoritative annual source, provenance is recorded and date/holiday checks pass. |
| Browser UI test automation | Larger | An isolated profile and fictional data check layout, persistence, calendar and muted video without touching a developer's daily browser. |

The current baseline is version 1.2.2: personal dashboard, read-only Google iCal feeds, local data, no ads or telemetry. Direct OAuth, editing Google events, weather and cloud sync are outside the current scope.
