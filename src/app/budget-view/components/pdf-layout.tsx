'use client'

import React, { ReactNode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

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

            const pageHeight = window.innerHeight;
            const pageWidth = window.innerWidth;
            const padding = Math.min(40, pageWidth * 0.05);
            const headerHeight = header ? Math.min(100, pageHeight * 0.1) : 0;
            const footerHeight = footer ? Math.min(100, pageHeight * 0.1) : 0;

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
                    className="pdf-page w-full min-h-screen p-4 sm:p-8 box-border relative flex flex-col"
                >
                    {header && <HeaderComponent>{header}</HeaderComponent>}
                    <div className="pdf-content flex-1 overflow-hidden w-full">
                        {pageContent}
                    </div>
                    {footer && <FooterComponent pageNumber={pageNumber} totalPages={totalPages}>{footer}</FooterComponent>}
                </div>
            );

            const measureChildHeight = (child: ReactNode): number => {
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'absolute';
                tempContainer.style.visibility = 'hidden';
                tempContainer.style.width = '100%';

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

        const handleResize = () => {
            setIsReady(false);
            const timer = setTimeout(paginateContent, 200);
            return () => clearTimeout(timer);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
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
    <div className="pdf-header w-full mb-4 sm:mb-8 z-10">
        {children}
    </div>
);

const FooterComponent: React.FC<{ pageNumber: number, totalPages: number, children: ReactNode }> = ({ pageNumber, totalPages, children }) => (
    <div className="pdf-footer w-full mt-4 sm:mt-8 z-10">
        {children}
        <div className="pdf-page-number text-right mt-2 sm:mt-4">
            Página {pageNumber + 1} de {totalPages + 1}
        </div>
    </div>
);

const LoadingView: React.FC<{ header?: ReactNode, footer?: ReactNode, children: ReactNode }> = ({ header, footer, children }) => (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-8 bg-white text-black">
        <main className="bg-white w-full max-w-4xl p-4 sm:p-8">
            {header && <div className="pdf-header">{header}</div>}
            <div>{children}</div>
            {footer && <div className="pdf-footer">{footer}</div>}
        </main>
    </div>
);

export default PdfLayout;
