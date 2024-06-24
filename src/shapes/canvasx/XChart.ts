import { ObjectProps } from '../Object/types/ObjectProps';
import { FabricObject } from '../Object/FabricObject';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { classRegistry } from '../../ClassRegistry';
import { createCanvasElement } from '../../util/misc/dom';

Chart.register(...registerables);

interface ChartObjectOptions extends ObjectProps {
  chartConfig: ChartConfiguration;
  width: number;
  height: number;
}

class XChart extends FabricObject {
  private chartConfig: ChartConfiguration;
  private chartInstance: Chart | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private needsUpdate: boolean = true; // Flag to track if update is needed

  constructor(options: Partial<ChartObjectOptions>) {
    super(options);
    this.chartConfig = options.chartConfig!;
    this.width = options.width!;
    this.height = options.height!;
    this.createCanvasElement();
    this.addDoubleClickEventListener();
  }

  private createCanvasElement() {
    if (!this.canvasElement) {
      this.canvasElement = createCanvasElement();
      this.canvasElement.width = this.width!;
      this.canvasElement.height = this.height!;
      this.canvasElement.style.width = `${this.width}px`;
      this.canvasElement.style.height = `${this.height}px`;
      this.canvasElement.style.position = 'absolute';
      this.canvasElement.style.top = `${-1000000}px`;
      this.canvasElement.style.left = `${-1000000}px`;

      document.body.appendChild(this.canvasElement); // Ensure canvas is in the DOM
    }
  }

  private async createOrUpdateChart() {
    if (!this.canvasElement) {
      this.createCanvasElement();
    }

    // Ensure the canvas element is part of the DOM
    if (!document.body.contains(this.canvasElement!)) {
      document.body.appendChild(this.canvasElement!);
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    return new Promise<void>((resolve) => {
      this.canvasElement!.width = this.width!;
      this.canvasElement!.height = this.height!;
      this.canvasElement!.style.width = `${this.width}px`;
      this.canvasElement!.style.height = `${this.height}px`;

      this.chartInstance = new Chart(
        this.canvasElement!.getContext('2d')!,
        this.chartConfig
      );

      // Wait for the next animation frame to ensure the chart has rendered
      requestAnimationFrame(() => {
        this.chartInstance!.resize(); // Force a resize to ensure proper rendering
        resolve();
      });
    });
  }

  async _render(ctx: CanvasRenderingContext2D) {
    if (this.needsUpdate) {
      await this.createOrUpdateChart();
      this.needsUpdate = false; // Reset the flag after updating
    }

    if (
      this.canvasElement &&
      this.canvasElement.width > 0 &&
      this.canvasElement.height > 0
    ) {
      ctx.drawImage(
        this.canvasElement,
        -this.width! / 2,
        -this.height! / 2,
        this.width!,
        this.height!
      );
    }
  }

  updateChart(newConfig: ChartConfiguration) {
    this.chartConfig = newConfig;
    this.needsUpdate = true; // Set the flag to indicate an update is needed
    this.dirty = true;
    this.canvas?.requestRenderAll();
  }

  private addDoubleClickEventListener() {
    this.on('mousedblclick', () => {
      this.openEditModal();
    });
  }

  private openEditModal() {
    // Implement modal opening logic here
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.width = '400px';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.padding = '20px';
    modal.style.backgroundColor = 'white';
    modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    modal.innerHTML = `
      <h2>Edit Chart Data</h2>
      <textarea id="chartDataInput" rows="10" cols="40">${JSON.stringify(
        this.chartConfig.data,
        null,
        2
      )}</textarea>
      <br />
      <button id="saveChartData">Save</button>
      <button id="cancelEdit">Cancel</button>
    `;
    document.body.appendChild(modal);

    const saveButton = modal.querySelector('#saveChartData')!;
    const cancelButton = modal.querySelector('#cancelEdit')!;
    const chartDataInput = modal.querySelector(
      '#chartDataInput'
    ) as HTMLTextAreaElement;

    saveButton.addEventListener('click', () => {
      const newChartData = JSON.parse(chartDataInput.value);
      this.chartConfig.data = newChartData;
      this.updateChart(this.chartConfig);
      document.body.removeChild(modal);
    });

    cancelButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }
}

export { XChart };

classRegistry.setClass(XChart);
