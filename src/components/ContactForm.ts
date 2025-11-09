/**
 * Contact Form Web Component
 * Handles form submission with validation
 */

class ContactForm extends HTMLElement {
  private endpoint: string;
  private fields: string[];
  private form!: HTMLFormElement;

  constructor() {
    super();
    this.endpoint = this.getAttribute('endpoint') || '/api/contact';
    this.fields = (this.getAttribute('fields')?.split(',') || ['name', 'email', 'message']).map(f => f.trim());
  }

  connectedCallback(): void {
    this.createForm();
    this.bindEvents();
  }

  private createForm(): void {
    this.form = document.createElement('form');
    this.form.className = 'contact-form';
    this.form.innerHTML = `
      <div class="form-group">
        <label for="name" class="form-label">Name</label>
        <input type="text" id="name" name="name" class="form-input" required>
      </div>

      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" name="email" class="form-input" required>
      </div>

      <div class="form-group">
        <label for="message" class="form-label">Message</label>
        <textarea id="message" name="message" class="form-textarea" rows="5" required></textarea>
      </div>

      <button type="submit" class="form-submit">Send Message</button>
    `;

    this.appendChild(this.form);
  }

  bindEvents() {
    this.form.addEventListener('submit', event => this.handleSubmit(event));
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData(this.form);
    const data = Object.fromEntries((formData as any).entries());

    // Basic validation
    if (!this.validateForm(data)) {
      return;
    }

    try {
      this.setLoading(true);

      // Simulate API call
      await this.submitForm(data);

      this.showSuccess('Message sent successfully!');
      this.form.reset();
    } catch (error) {
      this.showError('Failed to send message. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      this.setLoading(false);
    }
  }

  validateForm(data: Record<string, any>): boolean {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push('Name is required');
    }
    if (!data.email?.trim()) {
      errors.push('Email is required');
    }
    if (!data.message?.trim()) {
      errors.push('Message is required');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (errors.length > 0) {
      this.showError(errors.join('<br>'));
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async submitForm(data: Record<string, any>): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real application, you would send this to your backend
    console.log('Form submitted:', data);
  }

  setLoading(loading: boolean): void {
    const submitButton = this.form.querySelector('.form-submit') as HTMLButtonElement;
    submitButton.disabled = loading;
    submitButton.textContent = loading ? 'Sending...' : 'Send Message';
  }

  showSuccess(message: string): void {
    this.showMessage(message, 'success');
  }

  showError(message: string): void {
    this.showMessage(message, 'error');
  }

  showMessage(message: string, type: string): void {
    // Remove existing messages
    const existingMessage = this.form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.innerHTML = message;

    this.form.insertBefore(messageDiv, this.form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  destroy(): void {
    if (this.form && this.form.parentNode) {
      this.form.parentNode.removeChild(this.form);
    }
  }
}

// Register the custom element
customElements.define('contact-form', ContactForm);

export default ContactForm;
