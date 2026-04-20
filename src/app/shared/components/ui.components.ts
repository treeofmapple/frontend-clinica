import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-actions"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
    }
    .page-title { font-size: 1.625rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; margin-bottom: 2px; }
    .page-subtitle { color: #475569; font-size: 0.9375rem; }
    .header-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn" [class]="'btn-' + variant + (size ? ' btn-' + size : '')" [disabled]="disabled || loading" [type]="type">
      <span class="btn-spinner" *ngIf="loading"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 18px; border-radius: 10px;
      font-size: 0.9rem; font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.15s cubic-bezier(0.4,0,0.2,1);
      white-space: nowrap; cursor: pointer; border: 1.5px solid transparent;
      &:disabled { opacity: 0.65; cursor: not-allowed; }
    }
    .btn-primary { background: #2563eb; color: white; border-color: #2563eb;
      &:hover:not(:disabled) { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.3); transform: translateY(-1px); }
    }
    .btn-secondary { background: white; color: #0f172a; border-color: #e2e8f0;
      &:hover:not(:disabled) { border-color: #94a3b8; background: #f8fafc; }
    }
    .btn-danger { background: #dc2626; color: white; border-color: #dc2626;
      &:hover:not(:disabled) { background: #b91c1c; }
    }
    .btn-success { background: #059669; color: white; border-color: #059669;
      &:hover:not(:disabled) { background: #047857; }
    }
    .btn-ghost { background: transparent; color: #475569; border-color: transparent;
      &:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; }
    }
    .btn-sm { padding: 6px 12px; font-size: 0.8125rem; border-radius: 7px; }
    .btn-lg { padding: 12px 24px; font-size: 1rem; border-radius: 12px; }
    .btn-spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BtnComponent {
  @Input() variant: 'primary'|'secondary'|'danger'|'success'|'ghost' = 'primary';
  @Input() size: 'sm'|''|'lg' = '';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button'|'submit'|'reset' = 'button';
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon" [innerHTML]="safeIcon"></div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 8px;
      padding: 32px 24px;
      min-height: 220px;
      max-width: 640px;
      margin: 18px auto 6px;
      background: linear-gradient(180deg, rgba(59,130,246,0.04), rgba(59,130,246,0.01));
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    .empty-icon {
      display: inline-flex;
      width: 72px;
      height: 72px;
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: 20px;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      color: var(--color-primary);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
      ::ng-deep svg { width: 32px; height: 32px; color: currentColor; }
    }
    h3 { font-size: 1.125rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 0; }
    p { color: var(--color-text-secondary); font-size: 0.9375rem; margin-bottom: 10px; max-width: 42ch; }
  `]
})
export class EmptyStateComponent implements OnChanges {
  @Input() title = 'Nenhum registro encontrado';
  @Input() message = 'Comece adicionando um novo item.';
  @Input() icon = `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 16H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clip-rule="evenodd"/></svg>`;
  safeIcon: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {
    this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(this.icon);
  }

  ngOnChanges(): void {
    this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(this.icon);
  }
}
