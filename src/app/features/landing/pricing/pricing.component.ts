import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {

  plans = [
    {
      name: 'Starter',
      price: '499',
      popular: false,
      features: [
        '10 Courses Access',
        'Certificate',
        'Community Support',
        'Basic Resources'
      ]
    },
    {
      name: 'Professional',
      price: '999',
      popular: true,
      features: [
        'Unlimited Courses',
        'Certificates',
        'Live Classes',
        'AI Learning Assistant',
        'Priority Support'
      ]
    },
    {
      name: 'Enterprise',
      price: '1999',
      popular: false,
      features: [
        'Everything in Pro',
        'Team Access',
        'Dedicated Mentor',
        'Advanced Analytics',
        'Custom Learning Paths'
      ]
    }
  ];

}