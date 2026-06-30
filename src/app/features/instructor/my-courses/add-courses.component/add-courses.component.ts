import { Component, ChangeDetectionStrategy, signal, computed, EventEmitter, Output, Input, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

type StepKey = 'basics' | 'curriculum' | 'requirements' | 'pricing' | 'review';

interface StepDef {
  key: StepKey;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-add-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    InputNumberModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCoursesComponent implements OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() courseCreated = new EventEmitter<any>();

  private fb = new FormBuilder();

  steps: StepDef[] = [
    { key: 'basics', label: 'Basics', icon: 'pi pi-info-circle' },
    { key: 'curriculum', label: 'Curriculum', icon: 'pi pi-book' },
    { key: 'requirements', label: 'Requirements', icon: 'pi pi-list-check' },
    { key: 'pricing', label: 'Pricing', icon: 'pi pi-dollar' },
    { key: 'review', label: 'Review', icon: 'pi pi-check-circle' },
  ];

  activeStepIndex = signal(0);
  activeStep = computed(() => this.steps[this.activeStepIndex()].key);

  categoryOptions = [
    { label: 'Development', value: 'Development' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Design', value: 'Design' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Business', value: 'Business' },
    { label: 'Other', value: 'Other' },
  ];

  levelOptions = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: 'All Levels', value: 'All Levels' },
  ];

  languageOptions = [
    { label: 'English', value: 'English' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Spanish', value: 'Spanish' },
  ];

  pricingTierOptions = [
    { label: 'Free', value: 'Free' },
    { label: 'One-time Purchase', value: 'One-time' },
    { label: 'Subscription', value: 'Subscription' },
  ];

  thumbnailPreview = signal<string | null>(null);

  // ── Form Group ────────────────────────────────────────────────────────────
  form: FormGroup = this.fb.group({
    basics: this.fb.group({
      title: ['', Validators.required],
      category: [null, Validators.required],
      level: [null, Validators.required],
      language: ['English', Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(150)]],
      fullDescription: ['', Validators.required],
    }),
    curriculum: this.fb.group({
      sections: this.fb.array([this.createSection('Getting Started')]),
    }),
    requirements: this.fb.group({
      requirements: this.fb.array([this.fb.control('', Validators.required)]),
      outcomes: this.fb.array([this.fb.control('', Validators.required)]),
    }),
    pricing: this.fb.group({
      tier: ['One-time', Validators.required],
      price: [49, [Validators.required, Validators.min(0)]],
      discountPrice: [null],
      visibility: ['Draft', Validators.required],
    }),
  });

  // ── Curriculum (Sections → Lessons) ─────────────────────────────────────────
  get sectionsArray(): FormArray {
    return (this.form.get('curriculum') as FormGroup).get('sections') as FormArray;
  }

  createSection(name = ''): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      lessons: this.fb.array([this.createLesson()]),
    });
  }

  createLesson(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      duration: ['10', Validators.required],
      videoName: [null],
      videoUrl: [null],
      videoSize: [null],
    });
  }

  lessonsArray(sectionIndex: number): FormArray {
    return this.sectionsArray.at(sectionIndex).get('lessons') as FormArray;
  }

  addSection() {
    this.sectionsArray.push(this.createSection());
  }

  removeSection(index: number) {
    if (this.sectionsArray.length > 1) this.sectionsArray.removeAt(index);
  }

  addLesson(sectionIndex: number) {
    this.lessonsArray(sectionIndex).push(this.createLesson());
  }

  removeLesson(sectionIndex: number, lessonIndex: number) {
    const lessons = this.lessonsArray(sectionIndex);
    if (lessons.length > 1) {
      this.removeVideo(sectionIndex, lessonIndex);
      lessons.removeAt(lessonIndex);
    }
  }

  totalLessons(): number {
    return this.sectionsArray.controls.reduce(
      (sum, section) => sum + (section.get('lessons') as FormArray).length,
      0
    );
  }

  // ── Video Upload (per lesson, simulated progress) ───────────────────────────
  // Keyed by "sectionIndex-lessonIndex" → upload state
  videoUploadState = signal<Record<string, { progress: number; uploading: boolean; error?: string }>>({});
  private uploadIntervals: Record<string, ReturnType<typeof setInterval>> = {};

  private lessonKey(sectionIndex: number, lessonIndex: number): string {
    return `${sectionIndex}-${lessonIndex}`;
  }

  getUploadState(sectionIndex: number, lessonIndex: number) {
    return this.videoUploadState()[this.lessonKey(sectionIndex, lessonIndex)];
  }

  onVideoSelected(event: Event, sectionIndex: number, lessonIndex: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const maxSizeBytes = 500 * 1024 * 1024; // 500MB cap
    const key = this.lessonKey(sectionIndex, lessonIndex);
    const lessonGroup = this.lessonsArray(sectionIndex).at(lessonIndex) as FormGroup;

    if (!file.type.startsWith('video/')) {
      this.videoUploadState.update((state) => ({
        ...state,
        [key]: { progress: 0, uploading: false, error: 'Please select a valid video file.' },
      }));
      input.value = '';
      return;
    }

    if (file.size > maxSizeBytes) {
      this.videoUploadState.update((state) => ({
        ...state,
        [key]: { progress: 0, uploading: false, error: 'File exceeds 500MB limit.' },
      }));
      input.value = '';
      return;
    }

    // Start simulated upload
    this.videoUploadState.update((state) => ({
      ...state,
      [key]: { progress: 0, uploading: true, error: undefined },
    }));

    const objectUrl = URL.createObjectURL(file);
    const sizeLabel = this.formatFileSize(file.size);

    // Clear any existing interval for this slot (re-upload case)
    if (this.uploadIntervals[key]) clearInterval(this.uploadIntervals[key]);

    this.uploadIntervals[key] = setInterval(() => {
      const current = this.videoUploadState()[key];
      if (!current) return;

      const next = Math.min(current.progress + Math.random() * 18 + 7, 100);

      if (next >= 100) {
        clearInterval(this.uploadIntervals[key]);
        delete this.uploadIntervals[key];

        this.videoUploadState.update((state) => ({
          ...state,
          [key]: { progress: 100, uploading: false },
        }));

        lessonGroup.patchValue({
          videoName: file.name,
          videoUrl: objectUrl,
          videoSize: sizeLabel,
        });
      } else {
        this.videoUploadState.update((state) => ({
          ...state,
          [key]: { ...current, progress: next },
        }));
      }
    }, 220);

    input.value = '';
  }

  cancelUpload(sectionIndex: number, lessonIndex: number) {
    const key = this.lessonKey(sectionIndex, lessonIndex);
    if (this.uploadIntervals[key]) {
      clearInterval(this.uploadIntervals[key]);
      delete this.uploadIntervals[key];
    }
    this.videoUploadState.update((state) => {
      const { [key]: _removed, ...rest } = state;
      return rest;
    });
  }

  removeVideo(sectionIndex: number, lessonIndex: number) {
    const key = this.lessonKey(sectionIndex, lessonIndex);
    const lessonGroup = this.lessonsArray(sectionIndex).at(lessonIndex) as FormGroup;
    const currentUrl = lessonGroup.get('videoUrl')?.value;
    if (currentUrl) URL.revokeObjectURL(currentUrl);

    lessonGroup.patchValue({ videoName: null, videoUrl: null, videoSize: null });
    this.cancelUpload(sectionIndex, lessonIndex);
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  videosUploadedCount(): number {
    return this.sectionsArray.controls.reduce((sum, section) => {
      const lessons = (section.get('lessons') as FormArray).controls;
      return sum + lessons.filter((l) => !!l.get('videoUrl')?.value).length;
    }, 0);
  }

  ngOnDestroy() {
    Object.values(this.uploadIntervals).forEach(clearInterval);
  }

  // ── Requirements / Outcomes ──────────────────────────────────────────────────
  get requirementsArray(): FormArray {
    return (this.form.get('requirements') as FormGroup).get('requirements') as FormArray;
  }

  get outcomesArray(): FormArray {
    return (this.form.get('requirements') as FormGroup).get('outcomes') as FormArray;
  }

  addRequirement() {
    this.requirementsArray.push(this.fb.control('', Validators.required));
  }

  removeRequirement(i: number) {
    if (this.requirementsArray.length > 1) this.requirementsArray.removeAt(i);
  }

  addOutcome() {
    this.outcomesArray.push(this.fb.control('', Validators.required));
  }

  removeOutcome(i: number) {
    if (this.outcomesArray.length > 1) this.outcomesArray.removeAt(i);
  }

  // ── Thumbnail Upload ─────────────────────────────────────────────────────────
  onThumbnailSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.thumbnailPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeThumbnail() {
    this.thumbnailPreview.set(null);
  }

  // ── Step Navigation ───────────────────────────────────────────────────────────
  isStepValid(stepKey: StepKey): boolean {
    if (stepKey === 'review') return this.form.valid;
    const group = this.form.get(stepKey);
    return group ? group.valid : true;
  }

  goToStep(index: number) {
    this.activeStepIndex.set(index);
    this.publishBlockedReason.set(null);
  }

  nextStep() {
    if (this.activeStepIndex() < this.steps.length - 1) {
      this.activeStepIndex.set(this.activeStepIndex() + 1);
      this.publishBlockedReason.set(null);
    }
  }

  prevStep() {
    if (this.activeStepIndex() > 0) {
      this.activeStepIndex.set(this.activeStepIndex() - 1);
      this.publishBlockedReason.set(null);
    }
  }

  // ── Dialog Lifecycle ───────────────────────────────────────────────────────────
  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  saveDraft() {
    this.emitCourse('Draft');
  }

  publishBlockedReason = signal<string | null>(null);

  publish() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.publishBlockedReason.set('Please complete all required fields before publishing.');
      return;
    }
    if (this.videosUploadedCount() < this.totalLessons()) {
      this.publishBlockedReason.set('Upload videos for all lessons before publishing, or save as draft.');
      return;
    }
    this.publishBlockedReason.set(null);
    this.emitCourse('Published');
  }

  private emitCourse(status: string) {
    this.courseCreated.emit({ ...this.form.value, status, thumbnail: this.thumbnailPreview() });
    this.close();
  }

  effectivePrice = computed(() => {
    const pricing = this.form.get('pricing')?.value;
    return pricing?.discountPrice ?? pricing?.price ?? 0;
  });
}

