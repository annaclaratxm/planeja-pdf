'use client'

import { generatePdf } from '@/services/api/pdf-generator/actions';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import React from 'react';

interface BudgetGeneratePdfProps {
    budgetId: string;
}

const BudgetGeneratePdf: React.FC<BudgetGeneratePdfProps> = ({ budgetId }) => {
    const handleGeneratePdf = async () => {
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

            // Helper function to center text
            const centerText = (text: string, y: number) => {
                const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const x = (pageWidth - textWidth) / 2;
                doc.text(text, x, y);
            };

            // Helper function to add a line
            const addLine = (y: number) => {
                doc.line(10, y, pageWidth - 10, y);
            };

            // Title
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            centerText(`ORÇAMENTO ${budget.name}/${new Date().getFullYear()}`, 20);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');

            // Customer details
            doc.text(`Cliente: ${budget.customer.name}`, 10, 30);
            doc.text(`Fone: ${budget.customer.phone}`, 10, 35);

            addLine(40);

            // Budget details
            doc.setFont('helvetica', 'bold');
            doc.text('ORÇAMENTO PRÉVIO', 10, 50);
            doc.setFont('helvetica', 'normal');

            let yPos = 60;
            budget.categories.forEach((category) => {
                doc.text(`• ${category.name}`, 10, yPos);
                const totalPrice = category.products.reduce((sum, product) => sum + product.price, 0);
                doc.text(`R$ ${totalPrice.toFixed(2)}`, pageWidth - 50, yPos);
                yPos += 10;
            });

            doc.setFont('helvetica', 'bold');
            doc.text(`Total`, 10, yPos + 10);
            doc.text(`R$ ${budget.total.toFixed(2)}`, pageWidth - 50, yPos + 10);

            addLine(yPos + 15);

            // Additional information
            yPos += 25;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Este é um orçamento prévio com base nas imagens e fotografias enviadas pelo cliente. Podem', 10, yPos);
            doc.text('sofrer alterações de valores após a conferência de medidas e especificações de materiais', 10, yPos + 5);
            doc.text('divergentes às imagens enviadas.', 10, yPos + 10);

            yPos += 20;
            doc.text('Forma e condições de pagamento: 40% de entrada e restante em 4 x com cheque. A vista (1+1)', 10, yPos);
            doc.text('com 5 % de desconto, ou tudo parcelado em até 18 x sem entrada no cartão de crédito com juros', 10, yPos + 5);
            doc.text('simples de 1,1% ao mês.', 10, yPos + 10);

            yPos += 20;
            doc.text('OBS: Móveis todos em MDF classificação E1, com garantia de 5 anos em toda a estrutura e', 10, yPos);
            doc.text('acabamentos e 01 ano de garantia nas ferragens, luminárias, vidros e espelhos.', 10, yPos + 5);

            yPos += 15;
            doc.text('Não está incluso neste orçamento: pedras, estofados, serviços de encanador e eletricista.', 10, yPos);

            yPos += 15;
            doc.text(`Prazo de entrega: até ${budget.shippingDate} dias`, 10, yPos);
            doc.text(`Validade deste orçamento: ${budget.validateDate} dias`, pageWidth / 2, yPos);

            // Signature
            yPos += 20;
            doc.line(10, yPos, 100, yPos);
            doc.text(budget.user.setting[0].companyName, 10, yPos + 5);
            doc.text(`${budget.user.name} (Ger. Comercial)`, 10, yPos + 10);
            doc.text(budget.user.setting[0].phone, 10, yPos + 15);

            // Date
            yPos += 30;
            doc.text(`${budget.user.setting[0].city}, ${format(new Date(), 'dd \'de\' MMMM \'de\' yyyy')}`, 10, yPos);

            // Footer
            doc.setFontSize(8);
            const footerText = `${budget.user.setting[0].street}`;
            //${budget.user.setting[0].neighborhood}
            centerText(footerText, 280);
            centerText(`E-mail ${budget.user.email} fone ${budget.user.setting[0].phone}`, 285);
            centerText(`CNPJ ${budget.user.setting[0].cnpj}`, 290);

            doc.save(`orcamento_${budget.name}_${new Date().getFullYear()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <button onClick={handleGeneratePdf} className="bg-blue-500 text-white py-2 px-4 rounded">
            Generate PDF
        </button>
    );
};

export default BudgetGeneratePdf;

