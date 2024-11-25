'use client';

import { generatePdf } from '@/services/api/pdf-generator/actions';
import jsPDF from 'jspdf';

export const BudgetGeneratePdf = async (budgetId: string) => {
    try {
        const budget = await generatePdf(budgetId);

        if (!budget) {
            throw new Error('Budget not found');
        }

        if (!budget.customer) {
            throw new Error('Customer not found');
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        const centerText = (text: string, y: number) => {
            const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const x = (pageWidth - textWidth) / 2;
            doc.text(text, x, y);
        };

        const addLine = (y: number) => {
            doc.line(10, y, pageWidth - 10, y);
        };

        doc.setFontSize(16);
        doc.setFont('heveltica', 'bold');
        centerText(`ORÇAMENTO ${budget.name}/${new Date().getFullYear()}`, 20);

        doc.setFontSize(12);
        doc.setFont('heveltica', 'normal');

        doc.text(`Cliente: ${budget.customer.name}`, 10, 30);
        doc.text(`Fone: ${budget.customer.phone}`, 10, 35);

        addLine(40);

        doc.setFont('heveltica', 'bold');
        doc.text('ORÇAMENTO', 10, 50);
        doc.setFont('heveltica', 'normal');

        let yPos = 60;
        budget.categories.forEach((category) => {
            doc.text(`• ${category.name}`, 10, yPos);
            const totalPrice = category.products.reduce((sum, product) => sum + product.price, 0);
            doc.text(`R$ ${totalPrice.toFixed(2)}`, pageWidth - 50, yPos);
            yPos += 10;

            category.products.forEach((product) => {
                doc.text(`  - ${product.name}`, 15, yPos);
                doc.text(`R$ ${product.price.toFixed(2)}`, pageWidth - 50, yPos);
                yPos += 10;
            });
        });

        doc.setFont('heveltica', 'bold');
        doc.text(`Total`, 10, yPos + 10);
        doc.text(`R$ ${budget.total.toFixed(2)}`, pageWidth - 50, yPos + 10);

        addLine(yPos + 15);

        yPos += 25;
        doc.setFontSize(10);
        doc.setFont('heveltica', 'normal');

        doc.text('Forma e condições de pagamento: 40% de entrada e restante em 4 x com cheque.', 15, yPos);
        doc.text('A vista (1+1) com 5 % de desconto, ou tudo parcelado em até 18 x sem entrada', 15, yPos + 5);
        doc.text('no cartão de crédito com juros simples de 1,1% ao mês', 15, yPos + 9);

        yPos += 30;

        const formatDate = (date: Date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const shippingDate = new Date(new Date().setDate(new Date().getDate() + 90));
        doc.text(`Prazo de entrega: ${formatDate(shippingDate)}`, 10, yPos);

        const validateDate = new Date(new Date().setDate(new Date().getDate() + 10));
        doc.text(`Validade deste orçamento: ${formatDate(validateDate)}`, pageWidth / 2, yPos);

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orcamento_${budget.name}_${new Date().getFullYear()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
