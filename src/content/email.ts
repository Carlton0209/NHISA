import outlookSignatures from '../assets/email/outlook-signatures.png';
import outlookEditSignature from '../assets/email/outlook-edit-signature.png';

export type StepExtra =
  | { kind: 'image'; prompt: string; label: string; src: string; alt: string }
  | { kind: 'external'; prompt: string; label: string; url: string }
  | { kind: 'route'; prompt: string; label: string; path: string };

export type Step = { title: string; body?: string; extras?: StepExtra[] };

export const MICROSOFT_GUIDE = 'https://support.microsoft.com/en-us/outlook/mail/how-to-add-and-change-an-email-signature-in-outlook';

export const DEVICES = {
  laptop: {
    title: 'Laptop',
    subtitle: 'Outlook on the web and desktop',
    steps: [
      {
        title: 'Open Outlook → Settings',
        body: 'In Settings, go to Account, then Signatures.',
        extras: [
          {
            kind: 'image',
            prompt: 'Question?',
            label: 'Here’s the real page!',
            src: outlookSignatures,
            alt: 'Outlook Settings with Account selected and the Signatures page open, showing an Add signature button.',
          },
        ],
      },
      {
        title: 'Add signature',
        body: 'Select + Add signature and give your new signature a name.',
        extras: [
          {
            kind: 'image',
            prompt: 'Not sure?',
            label: 'See the Edit signature window',
            src: outlookEditSignature,
            alt: 'The Outlook Edit signature window with formatting toolbar, signature text box and default options.',
          },
        ],
      },
      {
        title: 'Customize your signature',
        body: 'Type your details and format them with the toolbar: bold, colors, links.',
        extras: [
          { kind: 'external', prompt: 'Watch the video to have more info:', label: 'Microsoft’s signature guide', url: MICROSOFT_GUIDE },
          {
            kind: 'route',
            prompt: 'Here’s a sample — you can copy & paste it into your own signature draft directly!',
            label: 'Open the sample',
            path: '/job/email-signature/sample',
          },
        ],
      },
      {
        title: 'Make sure to save',
        body: 'Don’t forget to choose when your signature appears—on new emails, replies, or both.',
        extras: [
          {
            kind: 'image',
            prompt: 'Where to find this setting:',
            label: 'Default signature options',
            src: outlookSignatures,
            alt: 'Outlook Signatures settings with two menus: Default for new messages, and Default for replies and forwards.',
          },
        ],
      },
    ] satisfies Step[],
  },
  phone: {
    title: 'Phone',
    subtitle: 'Outlook mobile app',
    steps: [
      { title: 'Open Outlook', body: 'Open the Outlook app and sign in with your Syracuse University email.' },
      { title: 'Navigate to the side menu', body: 'Tap your profile picture or the menu icon in the top-left corner.' },
      { title: 'Open Settings', body: 'Tap the gear icon at the bottom of the side menu.' },
      {
        title: 'Tap on Signature',
        body: 'You’re all set to edit! Paste in your signature and it will be added to emails you send from your phone.',
        extras: [
          {
            kind: 'route',
            prompt: 'Need something to paste?',
            label: 'Open the sample',
            path: '/job/email-signature/sample',
          },
        ],
      },
    ] satisfies Step[],
  },
};

export type Device = keyof typeof DEVICES;
