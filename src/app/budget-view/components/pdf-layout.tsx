import React, { ReactNode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../[id]/pdf.css';

interface PdfLayoutProps {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
}

const PdfLayout: React.FC<PdfLayoutProps> = ({ children, header, footer }) => {
    const [pages, setPages] = useState<ReactNode[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const paginateContent = () => {
            if (typeof window === 'undefined') return;

            const pageHeight = 297 * 3.78;  // A4 height in pixels
            const pageWidth = 210 * 3.78;   // A4 width in pixels
            const padding = 40;             // Padding in pixels
            const headerHeight = header ? 100 : 0;  // Conditional header height
            const footerHeight = footer ? 100 : 0; // Conditional footer height

            const newPages: ReactNode[] = [];
            let currentPage: ReactNode[] = [];
            let currentHeight = 0;

            const childrenArray = React.Children.toArray(children);

            const createPage = (
                pageContent: ReactNode[],
                pageNumber: number,
                totalPages: number
            ) => (
                <div
                    key={`page-${pageNumber}`}
                    className="a4-page"
                    style={{ width: `${pageWidth}px`, height: `${pageHeight}px`, padding: `${padding}px`, boxSizing: 'border-box', position: 'relative', display: 'flex', flexDirection: 'column' }}
                >
                    {header && <HeaderComponent>{header}</HeaderComponent>}
                    <div className="pdf-content" style={{ flex: 1, overflow: 'hidden', width: '100%' }}>
                        {pageContent}
                    </div>
                    {footer && <FooterComponent pageNumber={pageNumber} totalPages={totalPages}>{footer}</FooterComponent>}
                </div>
            );

            const measureChildHeight = (child: ReactNode): number => {
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'absolute';
                tempContainer.style.visibility = 'hidden';
                tempContainer.style.width = `${pageWidth - (padding * 2)}px`;

                if (React.isValidElement(child)) {
                    const root = createRoot(tempContainer);
                    root.render(child);
                } else {
                    tempContainer.innerHTML = String(child);
                }

                document.body.appendChild(tempContainer);
                const childHeight = tempContainer.offsetHeight;
                document.body.removeChild(tempContainer);

                return childHeight;
            };

            const availablePageHeight = pageHeight - (padding * 2) - headerHeight - footerHeight;

            childrenArray.forEach((child, index) => {
                const childElement = React.isValidElement(child)
                    ? React.cloneElement(child as React.ReactElement, {
                        key: `page-${newPages.length}-child-${index}`,
                        className: 'pdf-content'
                    })
                    : child;

                const childHeight = measureChildHeight(childElement);

                if (currentHeight + childHeight > availablePageHeight) {
                    newPages.push(createPage(currentPage, newPages.length, Math.ceil(childrenArray.length / (availablePageHeight / childHeight))));
                    currentPage = [];
                    currentHeight = 0;
                }

                currentPage.push(childElement);
                currentHeight += childHeight;
            });

            if (currentPage.length > 0) {
                newPages.push(createPage(currentPage, newPages.length, Math.ceil(childrenArray.length / (availablePageHeight / currentHeight))));
            }

            setPages(newPages);
            setIsReady(true);
        };

        const timer = setTimeout(paginateContent, 200);
        return () => clearTimeout(timer);
    }, [children, header, footer]);

    if (!isReady) {
        return (
            <LoadingView header={header} footer={footer}>
                {children}
            </LoadingView>
        );
    }

    return <div className="pdf-container">{pages}</div>;
};

const HeaderComponent: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div className="pdf-header" style={{ width: '100%', marginBottom: '40px', zIndex: 10 }}>
        {children}
    </div>
);

const FooterComponent: React.FC<{ pageNumber: number, totalPages: number, children: ReactNode }> = ({ pageNumber, totalPages, children }) => (
    <div className="pdf-footer" style={{ width: '100%', marginTop: '40px', zIndex: 10 }}>
        {children}
        <div className="pdf-page-number" style={{ textAlign: 'right', marginTop: '10px' }}>
            Página {pageNumber + 1} de {totalPages + 1}
        </div>
    </div>
);

const LoadingView: React.FC<{ header?: ReactNode, footer?: ReactNode, children: ReactNode }> = ({ header, footer, children }) => (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 bg-white text-black">
        <main className="bg-white w-full max-w-4xl p-8">
            {header && <div className="pdf-header">{header}</div>}
            <div>{children}</div>
            {footer && <div className="pdf-footer">{footer}</div>}
        </main>
    </div>
);

export default PdfLayout;
