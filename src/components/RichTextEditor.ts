/**
 * Rich Text Editor Component
 * WYSIWYG editor for template content customization
 */

interface EditorOptions {
  placeholder: string | undefined;
  maxLength: number | undefined;
  allowedTags: string[] | undefined;
  onChange: ((content: string) => void) | undefined;
  onFocus: (() => void) | undefined;
  onBlur: (() => void) | undefined;
}

interface EditorState {
  content: string;
  isActive: boolean;
  selection: Range | null;
  history: string[];
  historyIndex: number;
}

class RichTextEditor extends HTMLElement {
  private options: EditorOptions;
  private state: EditorState;
  private editorElement: HTMLElement | null = null;
  private toolbarElement: HTMLElement | null = null;
  private onChangeCallback?: (content: string) => void;

  // Default allowed formatting tags
  private defaultAllowedTags = [
    'b',
    'strong',
    'i',
    'em',
    'u',
    'br',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'a',
  ];

  constructor() {
    super();
    this.options = {
      placeholder: undefined,
      maxLength: undefined,
      allowedTags: undefined,
      onChange: undefined,
      onFocus: undefined,
      onBlur: undefined,
    };
    this.state = {
      content: '',
      isActive: false,
      selection: null,
      history: [],
      historyIndex: -1,
    };
  }

  connectedCallback(): void {
    this.options = this.getOptions();
    this.render();
    this.bindEvents();
    this.loadContent();
  }

  private render(): void {
    const content = this.state.content || this.options.placeholder || 'Click to edit...';

    this.innerHTML = `
      <div class="rich-text-editor">
        <div class="editor-toolbar" style="display: none;">
          <div class="toolbar-group">
            <button class="toolbar-btn" data-command="bold" title="Bold">
              <strong>B</strong>
            </button>
            <button class="toolbar-btn" data-command="italic" title="Italic">
              <em>I</em>
            </button>
            <button class="toolbar-btn" data-command="underline" title="Underline">
              <u>U</u>
            </button>
          </div>

          <div class="toolbar-group">
            <button class="toolbar-btn" data-command="insertUnorderedList" title="Bullet List">
              •
            </button>
            <button class="toolbar-btn" data-command="insertOrderedList" title="Numbered List">
              1.
            </button>
          </div>

          <div class="toolbar-group">
            <button class="toolbar-btn" data-command="createLink" title="Insert Link">
              🔗
            </button>
            <button class="toolbar-btn" data-command="unlink" title="Remove Link">
              ❌
            </button>
          </div>

          <div class="toolbar-group">
            <button class="toolbar-btn" data-command="undo" title="Undo">
              ↶
            </button>
            <button class="toolbar-btn" data-command="redo" title="Redo">
              ↷
            </button>
          </div>

          <div class="toolbar-info">
            <span class="char-count">
              ${this.state.content.length}${this.options.maxLength ? `/${this.options.maxLength}` : ''}
            </span>
          </div>
        </div>

        <div class="editor-content"
             contenteditable="true"
             data-placeholder="${this.options.placeholder || 'Click to edit...'}">
          ${content}
        </div>
      </div>
    `;

    this.editorElement = this.querySelector('.editor-content') as HTMLElement;
    this.toolbarElement = this.querySelector('.editor-toolbar') as HTMLElement;
  }

  private bindEvents(): void {
    if (!this.editorElement || !this.toolbarElement) {
      return;
    }

    // Content editing events
    this.editorElement.addEventListener('input', () => {
      this.handleContentChange();
    });

    this.editorElement.addEventListener('focus', () => {
      this.showToolbar();
      this.options.onFocus?.();
    });

    this.editorElement.addEventListener('blur', () => {
      // Delay hiding toolbar to allow button clicks
      setTimeout(() => {
        if (!this.contains(document.activeElement)) {
          this.hideToolbar();
          this.options.onBlur?.();
        }
      }, 100);
    });

    this.editorElement.addEventListener('keydown', e => {
      this.handleKeydown(e);
    });

    this.editorElement.addEventListener('paste', e => {
      this.handlePaste(e);
    });

    // Toolbar button events
    this.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const command = (e.currentTarget as HTMLElement).dataset.command;
        if (command) {
          this.executeCommand(command);
        }
      });
    });

    // Selection change to update toolbar state
    document.addEventListener('selectionchange', () => {
      if (this.state.isActive) {
        this.updateToolbarState();
      }
    });
  }

  private handleContentChange(): void {
    if (!this.editorElement) {
      return;
    }

    const newContent = this.editorElement.innerHTML;
    const plainText = this.editorElement.textContent || '';

    // Check length limit
    if (this.options.maxLength && plainText.length > this.options.maxLength) {
      // Truncate content
      const truncated = plainText.substring(0, this.options.maxLength);
      this.editorElement.textContent = truncated;
      this.state.content = this.editorElement.innerHTML;
    } else {
      this.state.content = newContent;
    }

    // Update character count
    this.updateCharCount();

    // Save to history
    this.saveToHistory(this.state.content);

    // Trigger callback
    this.onChangeCallback?.(this.state.content);
  }

  private handleKeydown(e: KeyboardEvent): void {
    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          this.executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          this.executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          this.executeCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          this.executeCommand('createLink');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            this.executeCommand('redo');
          } else {
            this.executeCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          this.executeCommand('redo');
          break;
      }
    }

    // Handle Enter key for better paragraph handling
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.executeCommand('insertParagraph');
    }
  }

  private handlePaste(e: ClipboardEvent): void {
    e.preventDefault();

    const text = e.clipboardData?.getData('text/plain') || '';
    const html = e.clipboardData?.getData('text/html');

    if (html && this.isValidHTML(html)) {
      // Clean HTML and insert
      const cleanHTML = this.cleanHTML(html);
      document.execCommand('insertHTML', false, cleanHTML);
    } else {
      // Insert plain text
      document.execCommand('insertText', false, text);
    }
  }

  private executeCommand(command: string): void {
    if (!this.editorElement) {
      return;
    }

    this.editorElement.focus();

    switch (command) {
      case 'createLink':
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;

      case 'insertParagraph':
        document.execCommand('insertParagraph', false);
        break;

      default:
        document.execCommand(command, false);
        break;
    }

    // Update toolbar state after command
    this.updateToolbarState();

    // Trigger content change
    this.handleContentChange();
  }

  private updateToolbarState(): void {
    if (!this.toolbarElement) {
      return;
    }

    const commands = ['bold', 'italic', 'underline', 'strikeThrough'];

    commands.forEach(command => {
      const btn = this.toolbarElement!.querySelector(`[data-command="${command}"]`) as HTMLElement;
      if (btn) {
        if (document.queryCommandState(command)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });
  }

  private updateCharCount(): void {
    const charCount = this.querySelector('.char-count');
    if (charCount && this.editorElement) {
      const length = this.editorElement.textContent?.length || 0;
      const max = this.options.maxLength;
      charCount.textContent = max ? `${length}/${max}` : `${length}`;

      // Add warning class if near limit
      if (max && length > max * 0.9) {
        charCount.classList.add('warning');
      } else {
        charCount.classList.remove('warning');
      }
    }
  }

  private showToolbar(): void {
    if (this.toolbarElement) {
      this.toolbarElement.style.display = 'flex';
      this.state.isActive = true;
    }
  }

  private hideToolbar(): void {
    if (this.toolbarElement) {
      this.toolbarElement.style.display = 'none';
      this.state.isActive = false;
    }
  }

  private saveToHistory(content: string): void {
    // Remove any history after current index
    this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);

    // Add new content to history
    this.state.history.push(content);
    this.state.historyIndex = this.state.history.length - 1;

    // Limit history size
    if (this.state.history.length > 50) {
      this.state.history.shift();
      this.state.historyIndex--;
    }
  }

  private undo(): void {
    if (this.state.historyIndex > 0) {
      this.state.historyIndex--;
      const content = this.state.history[this.state.historyIndex] || '';
      if (this.editorElement) {
        this.editorElement.innerHTML = content;
        this.state.content = content;
        this.onChangeCallback?.(content);
      }
    }
  }

  private redo(): void {
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.historyIndex++;
      const content = this.state.history[this.state.historyIndex] || '';
      if (this.editorElement) {
        this.editorElement.innerHTML = content;
        this.state.content = content;
        this.onChangeCallback?.(content);
      }
    }
  }

  private cleanHTML(html: string): string {
    // Create a temporary element to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remove disallowed tags
    const allowedTags = this.options.allowedTags || this.defaultAllowedTags;
    const allElements = temp.querySelectorAll('*');

    allElements.forEach(el => {
      if (!allowedTags.includes(el.tagName.toLowerCase())) {
        // Replace with text content
        const text = document.createTextNode(el.textContent || '');
        el.parentNode?.replaceChild(text, el);
      } else {
        // Clean attributes
        Array.from(el.attributes).forEach(attr => {
          if (!['href', 'target', 'rel'].includes(attr.name)) {
            el.removeAttribute(attr.name);
          }
        });
      }
    });

    return temp.innerHTML;
  }

  private isValidHTML(html: string): boolean {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return !doc.querySelector('parsererror');
    } catch {
      return false;
    }
  }

  private loadContent(): void {
    // Load saved content from localStorage or attribute
    const savedKey = this.getAttribute('data-storage-key');
    const initialContent = this.getAttribute('data-content');

    if (savedKey) {
      try {
        const saved = localStorage.getItem(`editor-${savedKey}`);
        if (saved) {
          this.setContent(saved);
          return;
        }
      } catch (error) {
        console.warn('Failed to load saved content:', error);
      }
    }

    if (initialContent) {
      this.setContent(initialContent);
    }
  }

  private saveContent(): void {
    const savedKey = this.getAttribute('data-storage-key');
    if (savedKey && this.state.content) {
      try {
        localStorage.setItem(`editor-${savedKey}`, this.state.content);
      } catch (error) {
        console.warn('Failed to save content:', error);
      }
    }
  }

  private getOptions(): EditorOptions {
    return {
      placeholder: this.getAttribute('placeholder') || undefined,
      maxLength: this.getAttribute('maxlength')
        ? parseInt(this.getAttribute('maxlength')!)
        : undefined,
      allowedTags: this.getAttribute('allowed-tags')
        ? this.getAttribute('allowed-tags')!.split(',')
        : undefined,
      onChange: undefined,
      onFocus: undefined,
      onBlur: undefined,
    };
  }

  // Public API
  setContent(content: string): void {
    const safeContent = content || '';
    this.state.content = safeContent;
    if (this.editorElement) {
      this.editorElement.innerHTML = safeContent;
    }
    this.saveToHistory(safeContent);
    this.updateCharCount();
  }

  getContent(): string {
    return this.state.content;
  }

  getPlainText(): string {
    return this.editorElement?.textContent || '';
  }

  override focus(): void {
    this.editorElement?.focus();
  }

  override blur(): void {
    this.editorElement?.blur();
  }

  onChange(callback: (content: string) => void): void {
    this.onChangeCallback = callback;
  }

  destroy(): void {
    // Clean up event listeners
    this.editorElement?.removeEventListener('input', this.handleContentChange);
    this.editorElement?.removeEventListener('focus', () => this.showToolbar());
    this.editorElement?.removeEventListener('blur', () => this.hideToolbar());
  }
}

// Register the custom element
customElements.define('rich-text-editor', RichTextEditor);

export default RichTextEditor;
