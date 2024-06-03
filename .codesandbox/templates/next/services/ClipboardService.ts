export default class ClipboardService {
  public _objects: any;

  static service: ClipboardService;

  static getInstance(): ClipboardService {
    if (ClipboardService.service == null) {
      ClipboardService.service = new ClipboardService();
    }
    return ClipboardService.service;
  }

  constructor() {
    this._objects = [];
  }

  makeError() {
    return new DOMException("The request is not allowed", "NotAllowedError");
  }

  async clipboardCopy(text: string) {
    try {
      if (!navigator.clipboard) {
        throw this.makeError();
      }
      navigator.clipboard.writeText(text);
    } catch (err) {
      // ...Otherwise, use document.execCommand() fallback
      try {
        // Put the text to copy into a <span>
        const span = document.createElement("span");

        span.textContent = text;

        // Preserve consecutive spaces and newlines
        span.style.whiteSpace = "pre";

        span.style.webkitUserSelect = "auto";

        span.style.userSelect = "all";

        // Add the <span> to the page
        document.body.appendChild(span);

        // Make a selection object representing the range of text selected by the user
        const selection = window.getSelection();

        const range = window.document.createRange();

        selection?.removeAllRanges();

        range.selectNode(span);

        selection?.addRange(range);

        // Copy text to the clipboard
        let success = false;
        try {
          success = window.document.execCommand("copy");
        } finally {
          // Cleanup
          selection?.removeAllRanges();

          window.document.body.removeChild(span);
        }

        if (!success) throw this.makeError();
      } catch (err2) {
        throw err2 || err || this.makeError();
      }
    }
  }

  async pasteWidget() {}

  async pasteWebsite() {}
}
