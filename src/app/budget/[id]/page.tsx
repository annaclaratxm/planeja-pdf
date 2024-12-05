'use client';

import { useEffect, useState } from 'react';
import BudgetPDF from "../components/budget-pdf/budget-pdf";
import { getLayoutData, LayoutData } from '../services/api/pdf-generator/getLayoutData';
import "../styles/print.css";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function BudgetPage({ params }: PageProps) {
    const [id, setId] = useState<string | null>(null);
    const [data, setData] = useState<LayoutData | null>(null);

    useEffect(() => {
        params.then((resolvedParams) => {
            setId(resolvedParams.id);
        });
    }, [params]);


    useEffect(() => {
        if (id && !data) {
            const fetchData = getLayoutData(id);

            fetchData.then((findedData) => {
                setData(findedData);
            });
        }
    }, [id, data]);

    if (!id || !data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ margin: 'auto', background: 'none', display: 'block', shapeRendering: 'auto' }}
                        width="50px"
                        height="50px"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid"
                    >
                        <circle cx="50" cy="50" fill="none" stroke="#000" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                repeatCount="indefinite"
                                dur="1s"
                                values="0 50 50;360 50 50"
                                keyTimes="0;1"
                            />
                        </circle>
                    </svg>
                    <div>Loading...</div>
                </div>
            </div>
        );
    }

    return <BudgetPDF data={data} />
}