import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

export interface Course {
  id: number;
  abbr: string;
  abbrColor: string;
  abbrBg: string;
  name: string;
  description: string;
  category: string;
  categoryType: 'development' | 'backend' | 'design' | 'other';
  students: number;
  status: 'Published' | 'Draft' | 'Archived';
  updated: string;
}

@Component({
  selector: 'app-course-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, AvatarModule, TagModule, InputTextModule, MenuModule, TooltipModule],
  templateUrl: './course-builder.component.html',
  styleUrls: ['./course-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorCourseBuilderComponent {
 
  searchQuery = signal('');
  currentPage = signal(1);
  pageSize = 5;
  sortOrder = signal('Newest First');

  statCards = [
    { label: 'Total Courses', value: 18, sub: 'All Courses', icon: 'pi pi-book', iconBg: '#EEF2FF', iconColor: '#6366F1' },
    { label: 'Published', value: 12, sub: 'Courses Live', icon: 'pi pi-check-square', iconBg: '#F0FDF4', iconColor: '#22C55E' },
    { label: 'Drafts', value: 6, sub: 'In Progress', icon: 'pi pi-hourglass', iconBg: '#FFF7ED', iconColor: '#F97316' },
    { label: 'Archived', value: 2, sub: 'Not Visible', icon: 'pi pi-inbox', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  ];

  allCourses: Course[] = [
    { id: 1, abbr: 'JS', abbrColor: '#fff', abbrBg: '#F59E0B', name: 'JavaScript Mastery', description: 'Complete JavaScript course from basics to advanced', category: 'Development', categoryType: 'development', students: 542, status: 'Published', updated: 'May 28, 2025' },
    { id: 2, abbr: 'A', abbrColor: '#fff', abbrBg: '#EF4444', name: 'Angular Advanced', description: 'Advanced Angular concepts and real-world projects', category: 'Development', categoryType: 'development', students: 421, status: 'Published', updated: 'May 26, 2025' },
    { id: 3, abbr: 'TS', abbrColor: '#fff', abbrBg: '#3B82F6', name: 'TypeScript Basics', description: 'Learn TypeScript from scratch with practical examples', category: 'Development', categoryType: 'development', students: 321, status: 'Published', updated: 'May 20, 2025' },
    { id: 4, abbr: 'JS', abbrColor: '#fff', abbrBg: '#22C55E', name: 'Node.js Complete Guide', description: 'Backend development with Node.js, Express and MongoDB', category: 'Backend', categoryType: 'backend', students: 298, status: 'Draft', updated: 'May 18, 2025' },
    { id: 5, abbr: '✿', abbrColor: '#fff', abbrBg: '#F97316', name: 'React for Beginners', description: 'Build modern UIs with React step by step', category: 'Development', categoryType: 'development', students: 276, status: 'Draft', updated: 'May 15, 2025' },
    { id: 6, abbr: 'PY', abbrColor: '#fff', abbrBg: '#6366F1', name: 'Python Fundamentals', description: 'Learn Python from scratch for beginners', category: 'Development', categoryType: 'development', students: 210, status: 'Published', updated: 'May 10, 2025' },
    { id: 7, abbr: 'DB', abbrColor: '#fff', abbrBg: '#8B5CF6', name: 'Database Design', description: 'SQL and NoSQL database design principles', category: 'Backend', categoryType: 'backend', students: 180, status: 'Archived', updated: 'Apr 28, 2025' },
    { id: 8, abbr: 'UI', abbrColor: '#fff', abbrBg: '#EC4899', name: 'UI/UX Design Basics', description: 'Design principles for modern web applications', category: 'Design', categoryType: 'design', students: 155, status: 'Archived', updated: 'Apr 20, 2025' },
  ];

  filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.allCourses.filter(c =>
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  });

  totalPages = computed(() => Math.ceil(this.filteredCourses().length / this.pageSize));

  pagedCourses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredCourses().slice(start, start + this.pageSize);
  });

  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  totalShowing = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, this.filteredCourses().length);
    return `Showing ${start} to ${end} of ${this.filteredCourses().length} courses`;
  });

  onSearch(val: string) {
    this.searchQuery.set(val);
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }

  prevPage() { this.goToPage(this.currentPage() - 1); }
  nextPage() { this.goToPage(this.currentPage() + 1); }
}