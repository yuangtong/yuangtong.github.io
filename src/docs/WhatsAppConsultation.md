# WhatsApp Consultation Modal

Purpose: provide a confirmation modal that gathers name, availability, and country, then opens a WhatsApp chat with a professional, preformatted message.

## Structure
- `components/Feature/WhatsAppConsultationModal.tsx`: modal UI + form + validation.
- `components/ui/Modal.tsx`: base modal component used for layout and animation.
- `hooks/useWhatsAppLink.ts`: detects country/timezone and generates the WhatsApp link.
- `services/geo.ts`: country and timezone detection.
- `services/whatsapp.ts`: phone validation, message construction, URL builder.
- `utils/sanitize.ts`: input sanitization and text clamping.
- `constants/contact.ts`: WhatsApp number and message length limit.

## Usage
```tsx
import React, { useState } from 'react';
import MagnetButton from '../ui/MagnetButton';
import WhatsAppConsultationModal from '../Feature/WhatsAppConsultationModal';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <MagnetButton onClick={() => setIsOpen(true)} />
      <WhatsAppConsultationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

## Message format
```
Hello Yuang! I'm [name] and I'm interested in scheduling a free consultation. My available hours are:
[start] – [end] ([timezone])

[Country of origin]
```

## Limits and Validation
- Message length is clamped to `MESSAGE_CHAR_LIMIT` (default 900 chars).
- Required fields: name, start time, end time; end must be later than start.
- Country auto-detection uses `ipapi.co` (fallback: `navigator.language`).
- Phone validation uses E.164 regex.
- Inputs are sanitized to prevent XSS; message text is URL-encoded.

## Notes
- Redirection uses `window.location.assign` for better mobile behavior.
- Works cross-browser (Chrome, Firefox, Safari) and responsive.