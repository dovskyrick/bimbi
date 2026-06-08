# Inquire Button — UX Direction

## Recommendation: Contact form (primary) + Instagram link (secondary)

A small inline modal with a short contact form is the right call. It signals that this is a real gallery, not a side hustle. Instagram alone undersells it.

### The modal contains:
- Name field
- Message field (pre-filled with e.g. *"I'm interested in [Painting Title]"*)
- Send button

No email field needed from the buyer — you just want their message. The form submits via **Formspree** or **EmailJS** (both free for low volume, zero backend required) and lands in your inbox.

Below the Send button, a quiet secondary line:

> Or reach out directly on [Instagram](https://ig.me/m/YOUR_HANDLE)

This gives the impatient buyer an escape hatch without making Instagram the headline.

### Why this works
- The form looks serious and considered — it belongs on a gallery site
- The pre-filled message removes the "what do I even write" barrier
- Instagram is there but subordinate — it reads as a convenience, not the main channel
- No infrastructure beyond a free Formspree account (one config line in the form)

## Implementation effort
Low. Formspree needs only an `action` URL on the form. No backend, no API keys in the codebase.
