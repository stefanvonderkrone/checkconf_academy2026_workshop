# 01 History Stacking

- Track browser history changes: new pages, replaced pages, and back/forward navigation.
- Keep an app-side copy of the browser history.
- When search/filter values change, apply those changes to earlier history entries too.
- When the user navigates back to an older entry, update its URL if its search params are outdated.


# 02 View Transitions

- Enable built-in route transition animations with viewTransition.
- Detect whether navigation moves forward or backward.
- Use CSS to animate each direction differently.
- Disable transitions for URL replacements, so filter/search updates do not animate like page navigation.


# 03 Performance

- Analyze and improve rendering performance.
- Enable React Compiler tooling.
- Virtualize long hotel and offer lists so only visible items are rendered.
