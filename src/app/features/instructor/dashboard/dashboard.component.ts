import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, AvatarModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorDashboardComponent {
  selectedDate = 'May 31, 2025';

  statCards = [
    {
      label: 'Total Students',
      value: '1,248',
      change: '+12.5%',
      positive: true,
      icon: 'pi pi-graduation-cap',
      iconBg: '#EEF2FF',
      iconColor: '#6366F1',
    },
    {
      label: 'Total Courses',
      value: '18',
      change: '+8.2%',
      positive: true,
      icon: 'pi pi-book',
      iconBg: '#F0FDF4',
      iconColor: '#22C55E',
    },
    {
      label: 'Total Enrollments',
      value: '2,756',
      change: '+15.3%',
      positive: true,
      icon: 'pi pi-play-circle',
      iconBg: '#EFF6FF',
      iconColor: '#3B82F6',
    },
    {
      label: 'Total Earnings',
      value: '$4,830',
      change: '+10.6%',
      positive: true,
      icon: 'pi pi-dollar',
      iconBg: '#FFF7ED',
      iconColor: '#F97316',
    },
  ];

  earningsChartData = {
    labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Earnings',
        data: [1000, 1800, 2200, 3000, 4200, 5200],
        fill: true,
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        tension: 0.4,
        pointBackgroundColor: '#6366F1',
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
      },
    ],
  };

  earningsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` $${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9CA3AF', font: { size: 12 } },
      },
      y: {
        grid: { color: '#F3F4F6', drawBorder: false },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: '#9CA3AF',
          font: { size: 12 },
          callback: (v: number) => (v === 0 ? '0' : v >= 1000 ? v / 1000 + 'K' : v),
        },
        min: 0,
        max: 6000,
      },
    },
  };

  topCourses = [
    { name: 'JavaScript Mastery', abbr: 'JS', color: '#F59E0B', bg: '#FEF3C7', students: 542, revenue: '$1,542' },
    { name: 'Angular Advanced', abbr: 'NG', color: '#EF4444', bg: '#FEE2E2', students: 421, revenue: '$1,210' },
    { name: 'TypeScript Basics', abbr: 'TS', color: '#3B82F6', bg: '#EFF6FF', students: 321, revenue: '$856' },
    { name: 'Node.js Complete Guide', abbr: 'N', color: '#22C55E', bg: '#F0FDF4', students: 298, revenue: '$732' },
    { name: 'React for Beginners', abbr: 'R', color: '#F97316', bg: '#FFF7ED', students: 276, revenue: '$490' },
  ];

  recentEnrollments = [
    { name: 'Rahul Verma', course: 'Angular Advanced', courseColor: '#6366F1', time: '2 hours ago', initials: 'RV', bg: '#EEF2FF' },
    { name: 'Priya Sharma', course: 'JavaScript Mastery', courseColor: '#6366F1', time: '5 hours ago', initials: 'PS', bg: '#FEE2E2' },
    { name: 'Aman Singh', course: 'Node.js Complete Guide', courseColor: '#6366F1', time: '1 day ago', initials: 'AS', bg: '#FEF3C7' },
    { name: 'Neha Patel', course: 'React for Beginners', courseColor: '#6366F1', time: '2 days ago', initials: 'NP', bg: '#F0FDF4' },
    { name: 'Vikash Kumar', course: 'TypeScript Basics', courseColor: '#6366F1', time: '2 days ago', initials: 'VK', bg: '#EFF6FF' },
  ];

  activityChartData = {
    labels: ['Active', 'Inactive', 'Completed'],
    datasets: [
      {
        data: [62, 24, 14],
        backgroundColor: ['#6366F1', '#FCD34D', '#34D399'],
        hoverBackgroundColor: ['#4F46E5', '#F59E0B', '#10B981'],
        borderWidth: 0,
        spacing: 2,
      },
    ],
  };

  activityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
  };

  activityLegend = [
    { label: 'Active', value: '62% (773)', color: '#6366F1' },
    { label: 'Inactive', value: '24% (298)', color: '#FCD34D' },
    { label: 'Completed', value: '14% (177)', color: '#34D399' },
  ];

  recentReviews = [
    { name: 'Anjali Mehta', rating: 5, comment: 'Excellent course! Very well explained.', time: '2 days ago', initials: 'AM', bg: '#FEE2E2' },
    { name: 'Rohit Singh', rating: 4.5, comment: 'Very informative and easy to follow.', time: '4 days ago', initials: 'RS', bg: '#EFF6FF' },
    { name: 'Sneha Kapoor', rating: 5, comment: 'Best course I have taken so far.', time: '1 week ago', initials: 'SK', bg: '#F0FDF4' },
  ];

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(1);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }
}