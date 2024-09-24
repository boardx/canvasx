import { classRegistry } from '../../ClassRegistry';
import { XTextbox } from '../canvasx/XTextbox';
import html2canvas from 'html2canvas';
import { FabricImage } from '../../shapes/Image';
import hljs from 'highlight.js'; // https://highlightjs.org

//@ts-ignore
import markdownit from 'markdown-it';
//@ts-ignore
import javascript from 'highlight.js/lib/languages/javascript';
import { WidgetMarkdownInterface, EntityKeys } from './type/widget.entity.markdown';
import { WidgetType } from './type/widget.type';

hljs.registerLanguage('javascript', javascript);



class XMarkdown extends XTextbox implements WidgetMarkdownInterface {
  public markdownText: string;
  isEditing: boolean = false;
  private renderedImage: FabricImage | null = null;
  private md: any;

  static type: WidgetType = 'XMarkdown';
  static objType: WidgetType = 'XMarkdown';
  constructor(text: string, options: WidgetMarkdownInterface) {

    super(text, options);
    this.markdownText = options?.markdownText || text;
    this.objType = 'XMarkdown';
    // full options list (defaults)
    this.md = markdownit({
      // Enable HTML tags in source
      html: true,

      // Use '/' to close single tags (<br />).
      // This is only for full CommonMark compatibility.
      xhtmlOut: false,

      // Convert '\n' in paragraphs into <br>
      breaks: false,

      // CSS language prefix for fenced blocks. Can be
      // useful for external highlighters.
      langPrefix: 'language-',

      // Autoconvert URL-like text to links
      linkify: false,

      // Enable some language-neutral replacement + quotes beautification
      // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
      typographer: true,

      // Double + single quotes replacement pairs, when typographer enabled,
      // and smartquotes on. Could be either a String or an Array.
      //
      // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
      // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
      quotes: '“”‘’',

      // Highlighter function. Should return escaped HTML,
      // or '' if the source string is not changed and should be escaped externally.
      // If result starts with <pre... internal wrapper is skipped.
      highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          } catch (__) { }
        }

        return ''; // use external default escaping
      },
    });
    Object.assign(this, options);

    this.on('editing:entered', this.onEditingEntered.bind(this));
    this.on('editing:exited', this.onEditingExited.bind(this));
    this.on('scaling', this.onScaling.bind(this));
    this.on('resizing', this.onScaled.bind(this));
    this.renderMarkdown();
  }


  private onEditingEntered() {
    this.isEditing = true;
    this.text = this.markdownText;
    this.dirty = true;
    this.canvas?.renderAll();
  }

  private onEditingExited() {
    this.isEditing = false;
    this.markdownText = this.text;
    this.renderMarkdown();
  }

  private onScaling() {
    this.renderMarkdown();
    // Optional: You can add any logic needed during scaling
  }

  private onScaled() {
    this.renderMarkdown();
  }

  async renderMarkdown() {
    if (this.isEditing) return;

    const html = this.md.render(this.markdownText);
    this.parseHtmlToImage(html).then((img) => {
      this.renderedImage = img;
      this.dirty = true;
      this.canvas?.renderAll();
    });
  }


  getObject() {
    const entityKeys: string[] = EntityKeys;
    const result: Record<string, any> = {};

    entityKeys.forEach((key) => {
      if (key in this) {
        result[key] = (this as any)[key];
      }
    });

    return result;
  }

  private parseHtmlToImage(html: string): Promise<FabricImage> {
    return new Promise((resolve) => {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      const iframe = document.createElement('iframe');
      iframe.style.width = `${this.width}px`;
      iframe.style.height = `${this.height}px`;
      iframe.style.visibility = 'hidden';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);

      iframe.onload = async () => {
        if (iframe.contentDocument) {
          const style = iframe.contentDocument.createElement('style');
          style.textContent = `
            body { 
              font-family: Arial, sans-serif; 
              font-size: 14px; 
              line-height: 1.6; 
              color: #333; 
              padding: 20px; 
              margin: 0;
              width: ${this.width}px;
              height: ${this.height}px;
            }
            h1, h2, h3, h4, h5, h6 { margin-top: 0; }
            ul, ol { padding-left: 20px; }
          /* Code block styling */
code {
  background-color: #f5f5f5; /* Slightly lighter background for better contrast */
  padding: 3px 5px; /* More padding for better spacing */
  border-radius: 5px; /* Smoother border radius */
  font-family: 'Courier New', Courier, monospace; /* Monospace font for code */
}

pre {
  background-color: #f5f5f5; /* Matching background color with inline code */
  padding: 12px; /* Slightly more padding for comfort */
  border-radius: 5px; /* Smoother border radius */
  overflow-x: auto; /* Ensure horizontal scroll for long code lines */
  font-family: 'Courier New', Courier, monospace; /* Monospace font for code */
}

pre code {
  display: block;
}

/* Table styling */
table {
  border-collapse: collapse;
 
  margin-bottom: 1em; /* Add some margin below tables */
  font-family: Arial, sans-serif; /* Better font for readability */
}

table, th, td {
  border: 1px solid #ddd; /* Lighter border color for a cleaner look */
}

th, td {
  padding: 10px; /* More padding for better spacing */
  text-align: left;
}

th {
  background-color: #f2f2f2; /* Slight background color for headers */
  font-weight: bold; /* Bold headers */
}

td {
  background-color: #fff; /* Ensure a white background for table cells */
}

/* Additional table row hover effect */
tr:hover {
  background-color: #f1f1f1; /* Highlight row on hover */
}
          `;
          iframe.contentDocument.head.appendChild(style);
        }

        iframe.contentDocument!.body.innerHTML = html;

        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay to ensure styles are applied

        const canvas = await html2canvas(
          iframe.contentDocument?.body as HTMLElement
        );
        const img = await FabricImage.fromURL(canvas.toDataURL());
        img.set({
          left: this.left,
          top: this.top,
          width: this.width,
          height: this.height,
          scaleX: 1,
          scaleY: 1,
        });
        resolve(img);

        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      };

      iframe.src = url;
    });
  }

  setMarkdown(newMarkdownText: string) {
    this.markdownText = newMarkdownText;
    if (this.isEditing) {
      this.text = this.markdownText;
      this.dirty = true;
    } else {
      this.renderMarkdown();
    }
    this.canvas?.renderAll();
  }

  _render(ctx: CanvasRenderingContext2D) {
    if (this.isEditing) {
      super._render(ctx);
    } else if (this.renderedImage) {
      this.renderedImage._render(ctx);
    }
  }
}

export { XMarkdown };

classRegistry.setClass(XMarkdown);
