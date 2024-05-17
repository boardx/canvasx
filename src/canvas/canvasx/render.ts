/* global canvas */

// WBCanvas.prototype.renderCanvas = function (ctx, objects) {
//   // Get the viewport transformation
//   const v = this.viewportTransform;

//   // Get the path for clipping the canvas
//   const path = this.clipPath;

//   // Cancel any previously requested render
//   this.cancelRequestedRender();

//   // Recalculate the boundaries of the viewport
//   this.calcViewportBoundaries();

//   // Clear the context of the canvas
//   this.clearContext(ctx);

//   // Enable image smoothing
//   ctx.imageSmoothingEnabled = true;

//   // Trigger a custom event to signal the start of rendering
//   this.fire("before:render", { ctx });

//   // Render the background onto the context
//   this._renderBackground(ctx);

//   // Save the current state of the context
//   ctx.save();

//   // Apply the viewport transformation matrix to the context
//   ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);

//   // Render the objects onto the context
//   this._renderObjects(ctx, objects);

//   // Revert the context to the state saved earlier
//   ctx.restore();

//   // When controls are not over the overlay and canvas is interactive,
//   // draw the controls on the context
//   if (!this.controlsAboveOverlay && this.interactive) {
//     this.drawControls(ctx);
//   }

//   // When there is a clipping path, use it to clip the canvas
//   if (path) {
//     path.canvas = this;

//     // Setup a couple of variables for the clipping path
//     path.shouldCache();
//     path._transformDone = true;

//     // Render the clipping path cache
//     path.renderCache({ forClipping: true });

//     // Draw the clipping path on the canvas
//     this.drawClipPathOnCanvas(ctx);
//   }

//   // Render the overlay onto the context
//   this._renderOverlay(ctx);

//   // When controls are over the overlay and canvas is interactive,
//   // draw the controls on the context
//   if (this.controlsAboveOverlay && this.interactive) {
//     this.drawControls(ctx);
//   }

//   // Trigger a custom event to signal the end of rendering
//   this.fire("after:render", { ctx });
// };
