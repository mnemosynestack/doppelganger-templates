## 2023-10-27 - Missing Form Label Bindings
**Learning:** Found a recurring accessibility pattern where form inputs were missing `id` and `htmlFor` attributes, which prevents screen readers from properly associating labels with inputs and degrades keyboard navigation.
**Action:** Ensure all form labels have a `htmlFor` attribute that strictly matches the `id` of its corresponding input element.
