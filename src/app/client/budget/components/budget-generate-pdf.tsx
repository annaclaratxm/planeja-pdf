/* eslint-disable jsx-a11y/alt-text */
'use client';

import { generatePdf } from '@/services/api/pdf-generator/actions';
import { GetFileFromR2 } from '@/services/bucket/cloudflare';
import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
        backgroundColor: '#F5F5F5'
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5
    },
    logo: {
        maxWidth: 150,
        maxHeight: 75,
        objectFit: 'contain'
    },
    customerInfo: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5
    },
    customerInfoText: {
        color: '#555'
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        fontSize: 14,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 3
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        padding: 5,
        backgroundColor: '#F9F9F9'
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        padding: 3
    },
    totalSection: {
        marginTop: 15,
        borderTopWidth: 2,
        borderTopColor: '#333',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5
    },
    paymentTerms: {
        fontSize: 10,
        marginTop: 15,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5
    }
});

export const BudgetGeneratePdf = async (budgetId: string) => {
    try {
        const budget = await generatePdf(budgetId);

        if (!budget) throw new Error('Budget not found');
        if (!budget.customer) throw new Error('Customer not found');
        if (!budget.user) throw new Error('User not found');
        if (!budget.user.setting) throw new Error('User setting not found');

        let logoSrc: File | undefined;

        if (budget.user.setting[0].logo) {
            logoSrc = await GetFileFromR2(budget.user.setting[0].logo);
            console.log('logoSrc: ', logoSrc);
        }

        const formatDate = (days: number) => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date.toLocaleDateString('pt-BR');
        };

        const BudgetPdfDocument = (
            <Document>
                <Page size="A4" style={styles.page}>
                    {logoSrc && (
                        <Image src={logoSrc} style={styles.logo} />
                    )}

                    <Text style={styles.header}>
                        ORÇAMENTO {budget.name}/{new Date().getFullYear()}
                    </Text>

                    <View style={styles.customerInfo}>
                        <Text style={styles.customerInfoText}>Cliente: {budget.customer.name}</Text>
                        <Text style={styles.customerInfoText}>Fone: {budget.customer.phone}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>ORÇAMENTO</Text>

                    {budget.categories.map((category, index) => (
                        <View key={index}>
                            <View style={styles.categoryItem}>
                                <Text>• {category.name}</Text>
                                <Text>
                                    R$ {category.products.reduce((sum, product) => sum + product.price, 0).toFixed(2)}
                                </Text>
                            </View>

                            {category.products.map((product, productIndex) => (
                                <View key={productIndex} style={styles.productItem}>
                                    <Text>- {product.name}</Text>
                                    <Text>R$ {product.price.toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>
                    ))}

                    <View style={styles.totalSection}>
                        <Text style={styles.sectionTitle}>Total</Text>
                        <Text style={styles.sectionTitle}>R$ {budget.total.toFixed(2)}</Text>
                    </View>

                    <View style={styles.paymentTerms}>
                        <Text>Forma e condições de pagamento: 40% de entrada e restante em 4 x com cheque. A vista (1+1) com 5 % de desconto, ou tudo parcelado em até 18 x sem entrada no cartão de crédito com juros simples de 1,1% ao mês</Text>
                    </View>

                    <View style={styles.footer}>
                        <Text>Prazo de entrega: {formatDate(90)}</Text>
                        <Text>Validade deste orçamento: {formatDate(10)}</Text>
                    </View>
                </Page>
            </Document>
        );

        const blob = await pdf(BudgetPdfDocument).toBlob();
        const url = URL.createObjectURL(blob);
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