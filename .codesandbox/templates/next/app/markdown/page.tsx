
'use client';
import * as fabric from '../../../../../fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';

import { XMarkdown } from '../../../../../fabric';


const IndexPage: NextPage = () => {
    const ref = useRef<fabric.XCanvas>(null);

    const onLoad = useCallback(
        (canvas: fabric.XCanvas) => {
            canvas.setDimensions({
                width: document.documentElement.clientWidth
                ,
                height: document.documentElement.clientHeight
                    - 60,
            });
            const components = [
                new XMarkdown('Hello, **world**!\n\n\n\n\n\n', { width: 500, height: 50 }),
                new XMarkdown('# Header\n- List Item 1\n- List Item 2\n\n\n\n\n\n', { width: 500, height: 100 }),
                new XMarkdown('Here is some `inline code`.\n```\nfunction foo() { return "bar"; }\n```\n\n\n\n\n\n', { width: 500, height: 150 }),
                new XMarkdown('> This is a blockquote \n\n\n\n\n\n\n', { width: 500, height: 50 }),
                new XMarkdown('![Alt text](https://images.inc.com/uploaded_files/image/1920x1080/getty_691886452_405128.jpg)\n\n\n\n\n\n', { width: 500, height: 150 }),
                new XMarkdown('[Google](https://www.google.com)', { width: 500, height: 50 }),
                new XMarkdown('| Header 1 | Header 2 |\n| --- | --- |\n| Row 1 Col 1 | Row 1 Col 2 |\n| Row 2 Col 1 | Row 2 Col 2 |\n\n\n\n\n\n', { width: 500, height: 150 }),
                new XMarkdown('- Item 1\n  - Subitem 1\n  - Subitem 2\n- Item 2\n  - Subitem 1\n  - Subitem 2\n\n\n\n\n\n', { width: 500, height: 150 }),
                new XMarkdown('Text above\n\n---\n\nText below\n\n\n\n\n\n', { width: 500, height: 150 }),
                new XMarkdown('# Title\n## Subtitle\n\n- Point 1\n- Point 2\n\n> Quote\n\n[Link](https://example.com)\n\n\n\n\n\n', { width: 500, height: 300 })
            ];

            // const rows = Math.ceil(components.length / 4);
            const spacing = 20; // spacing between components


            components.forEach((component, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;
                const left = col * (500 + spacing) + 250 + spacing; // 250 is half of 500 (centered)
                const top = row * (500 + spacing) + 250 + spacing; // 250 is half of 500 (centered)

                component.set({
                    left: left,
                    top: top,
                    originX: 'center',
                    originY: 'center'
                });
                canvas.add(component);
            });



            canvas.zoomToViewAllObjects();
            (canvas as any).on('text:changed', (e) => {
                const target = e.target;
                if (target instanceof XMarkdown) {
                    target.setMarkdown(target.text);
                }
                // markdownText.setMarkdown(markdownText.text);
            });


        },
        [ref]
    );

    return (
        <div className="position-relative">
            <Canvas ref={ref} onLoad={onLoad} />
        </div>
    );
};

export default IndexPage;
