import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';

import { FormBuilder, FormControl, Validators } from '@angular/forms';

import {
  CollaborationTopic,
  ContactChannel,
  ContactFormData,
  ProjectType,
  ProjectTypeOption,
} from '../../interfaces/contact.interface';

type ContactControls = {
  [K in keyof ContactFormData]: FormControl<ContactFormData[K]>;
};

@Component({
  selector: 'app-contact-page',
  standalone: false,
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly email = 'ndaruhuyves@gmail.com';

  readonly submitted = signal(false);

  readonly projectTypes: readonly ProjectTypeOption[] = [
    { value: 'digital-platform', label: 'Digital platform' },
    { value: 'software-development', label: 'Software development' },
    { value: 'data-ai', label: 'Data & AI' },
    { value: 'automation', label: 'Automation' },
    { value: 'architecture', label: 'Architecture & integration' },
    { value: 'consulting', label: 'Technology consulting' },
    { value: 'other', label: 'Something else' },
  ];

  readonly contactChannels: readonly ContactChannel[] = [
    {
      number: '01',
      label: 'Email',
      value: this.email,
      href: `mailto:${this.email}`,
    },
    {
      number: '02',
      label: 'Based in',
      value: 'Kigali, Rwanda',
    },
    {
      number: '03',
      label: 'Timezone',
      value: 'UTC+2',
    },
  ];

  readonly collaborationTopics: readonly CollaborationTopic[] = [
    {
      number: '01',
      title: 'Build something new',
      description:
        'A new platform, application, internal system, API, data product, or digital service.',
    },
    {
      number: '02',
      title: 'Improve an existing system',
      description:
        'Architecture, integrations, workflows, performance, infrastructure, or modernization.',
    },
    {
      number: '03',
      title: 'Explore data & AI',
      description:
        'AI-enabled applications, automation, information access, agents, and data-driven workflows.',
    },
    {
      number: '04',
      title: 'Technical direction',
      description:
        'Architecture decisions, solution design, technology selection, and implementation planning.',
    },
  ];

  readonly contactForm = this.formBuilder.group<ContactControls>({
    name: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)],
    }),

    email: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),

    organization: this.formBuilder.nonNullable.control('', {
      validators: [Validators.maxLength(160)],
    }),

    projectType: this.formBuilder.nonNullable.control<ProjectType | ''>('', {
      validators: [Validators.required],
    }),

    message: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(3000)],
    }),
  });

  get nameControl() {
    return this.contactForm.controls.name;
  }

  get emailControl() {
    return this.contactForm.controls.email;
  }

  get projectTypeControl() {
    return this.contactForm.controls.projectType;
  }

  get messageControl() {
    return this.contactForm.controls.message;
  }

  isInvalid(field: keyof ContactControls): boolean {
    const control = this.contactForm.controls[field];

    return control.invalid && (control.touched || this.submitted());
  }

  getError(field: keyof ContactControls): string {
    const control = this.contactForm.controls[field];

    if (!this.isInvalid(field)) {
      return '';
    }

    if (control.hasError('required')) {
      return field === 'projectType' ? 'Please select a project type.' : 'This field is required.';
    }

    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }

    if (control.hasError('minlength')) {
      return field === 'name' ? 'Enter at least 2 characters.' : 'Enter at least 20 characters.';
    }

    if (control.hasError('maxlength')) {
      return 'Your response is too long.';
    }

    return 'Please check this field.';
  }

  submitForm(): void {
    this.submitted.set(true);

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const payload = this.contactForm.getRawValue();

    const name = payload.name.trim();
    const email = payload.email.trim();
    const organization = payload.organization.trim();
    const message = payload.message.trim();

    if (name.length < 2 || message.length < 20 || !email) {
      if (name.length < 2) {
        this.nameControl.setValue(name);
      }

      if (message.length < 20) {
        this.messageControl.setValue(message);
      }

      this.contactForm.markAllAsTouched();
      return;
    }

    const projectTypeLabel =
      this.projectTypes.find((option) => option.value === payload.projectType)?.label ?? 'Other';

    const subject = `Project inquiry from ${name}`;

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Organization: ${organization || 'Not provided'}`,
      `Project type: ${projectTypeLabel}`,
      '',
      'Project / message:',
      message,
    ].join('\n');

    const mailto =
      `mailto:${this.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    /*
     * Opens the visitor's configured email handler.
     * This does not confirm the email was sent.
     */
    this.document.defaultView?.location.assign(mailto);
  }
}
