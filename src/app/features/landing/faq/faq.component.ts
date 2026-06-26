import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, AccordionModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {

  faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Simply browse our course catalog, select your preferred course, and click Enroll Now.'
    },
    {
      question: 'Will I receive a certificate?',
      answer: 'Yes, all completed courses provide an industry-recognized certificate.'
    },
    {
      question: 'Can I access courses on mobile?',
      answer: 'Yes, courses are fully accessible on mobile, tablet, and desktop devices.'
    },
    {
      question: 'Are the classes live or recorded?',
      answer: 'We provide both live instructor-led sessions and recorded lectures.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 7-day refund policy for eligible courses.'
    },
    {
      question: 'Is there lifetime access?',
      answer: 'Most premium courses include lifetime access to learning materials.'
    }
  ];

}