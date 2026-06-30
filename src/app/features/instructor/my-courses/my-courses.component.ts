import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AddCoursesComponent } from './add-courses.component/add-courses.component';
import { InstructorCoursesService } from '../../../core/services/instructor-courses.service';
import { AuthService } from '../../../core/services/auth.service';

export interface MyCourse {
  id: number;
  abbr: string;
  abbrBg: string;
  abbrColor: string;
  name: string;
  description: string;
  students: number;
  lessons: number;
  duration: string;
  status: 'Published' | 'Draft' | 'Archived';
}

type TabKey = 'all' | 'published' | 'draft' | 'archived';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TooltipModule, AddCoursesComponent],
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorMyCoursesComponent implements OnInit {
  private readonly instructorCoursesService = inject(InstructorCoursesService);
  private readonly authService = inject(AuthService);

  // ─── Signals ───
  searchQuery = signal('');
  activeTab = signal<TabKey>('all');
  currentPage = signal(1);
  pageSize = signal(5);
  sortBy = signal('Newest');
  showAddCourse = false;
  loading = signal(false);
  loadError = signal<string | null>(null);

  // ✅ FIXED: allCourses is now a signal
  allCourses = signal<MyCourse[]>([]);

  pageSizeOptions = [5, 10, 15, 20];

  // ─── Stat Cards (static labels, dynamic values from signals) ───
  statCards = [
    { label: 'Total Courses', sub: 'Published courses', icon: 'pi pi-book', iconBg: '#EEF2FF', iconColor: '#6366F1' },
    { label: 'Published Courses', sub: 'Active and visible', icon: 'pi pi-file', iconBg: '#F0FDF4', iconColor: '#22C55E' },
    { label: 'Draft Courses', sub: 'In progress', icon: 'pi pi-clock', iconBg: '#FFF7ED', iconColor: '#F97316' },
    { label: 'Archived Courses', sub: 'Not visible to students', icon: 'pi pi-inbox', iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  ];

  // ─── Computed Signals ───
  // ✅ FIXED: tabCounts now reads from allCourses signal
  tabCounts = computed(() => ({
    all: this.allCourses().length,
    published: this.allCourses().filter(c => c.status === 'Published').length,
    draft: this.allCourses().filter(c => c.status === 'Draft').length,
    archived: this.allCourses().filter(c => c.status === 'Archived').length,
  }));

  // Alias for template
  stats = this.tabCounts;

  // ✅ FIXED: tabFiltered reads from allCourses signal
  tabFiltered = computed(() => {
    const tab = this.activeTab();
    if (tab === 'all') return this.allCourses();
    const map: Record<TabKey, string> = { all: '', published: 'Published', draft: 'Draft', archived: 'Archived' };
    return this.allCourses().filter(c => c.status === map[tab]);
  });

  filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.tabFiltered().filter(c =>
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredCourses().length / this.pageSize())));

  pagedCourses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredCourses().slice(start, start + this.pageSize());
  });

  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  // ─── Methods ───
  setTab(tab: TabKey) {
    this.activeTab.set(tab);
    this.currentPage.set(1);
  }

  onSearch(val: string) {
    this.searchQuery.set(val);
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }

  prevPage() { this.goToPage(this.currentPage() - 1); }
  nextPage() { this.goToPage(this.currentPage() + 1); }

  openCreateDialog() {
    this.showAddCourse = true;
  }

  onCourseCreated(course: any) {
    console.log('New course payload:', course);
    this.loadCourses(); // ✅ Refresh list after create
  }

  private getInstructorIdFromAuth(): string | null {
    const user = this.authService.currentUser;
    return user?.id ? String(user.id) : null;
  }

  // FIXED: Use allCourses.set() instead of direct assignment
  public loadCourses() {
    const instructorId = this.getInstructorIdFromAuth();
    if (!instructorId) {
      this.loadError.set('Not authenticated');
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);

    this.instructorCoursesService
      .listMyCourses({ instructorId })
      .subscribe({
        next: (res) => {
          const rawAll: any[] = Array.isArray((res as any)?.courses?.all)
            ? (res as any).courses.all
            : Array.isArray((res as any)?.courses)
              ? (res as any).courses
              : [];

          this.allCourses.set(rawAll.map((c: any) => {
            const status = c.isPublished ? 'Published' : 'Draft';
            const title: string = c.title || '';
            return {
              id: Number(c.id ?? c._id ?? 0) || 0,
              abbr: title ? title.slice(0, 2).toUpperCase() : 'C',
              abbrBg: '#6366F1',
              abbrColor: '#fff',
              name: title,
              description: c.description || '',
              students: Number(c.students ?? 0) || 0,
              lessons: Number(c.lessons ?? c.totalLessons ?? 0) || 0,
              duration: c.duration ? String(c.duration) : '',
              status: status as 'Published' | 'Draft' | 'Archived',
            };
          }));

          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loadError.set('Failed to load courses');
          this.loading.set(false);
        },
      });
  }

  ngOnInit() {
    this.loadCourses();
  }
}