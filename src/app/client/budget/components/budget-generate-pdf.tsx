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
        backgroundColor: '#FFFFFF',
        color: '#333333',
    },
    header: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 700,
        color: '#1a3a5a',
        textAlign: 'center',
        marginBottom: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        maxWidth: 150,
        maxHeight: 75,
        objectFit: 'contain',
    },
    section: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        borderColor: '#e9ecef',
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 500,
        color: '#1a3a5a',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    columnLeft: {
        width: '60%',
    },
    columnRight: {
        width: '35%',
        textAlign: 'right',
    },
    categoryItem: {
        marginBottom: 10,
    },
    categoryName: {
        fontWeight: 500,
        marginBottom: 5,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    totalSection: {
        marginTop: 20,
        borderTopWidth: 2,
        borderTopColor: '#1a3a5a',
        paddingTop: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 700,
        color: '#1a3a5a',
    },
    footer: {
        marginTop: 30,
        fontSize: 8,
        color: '#6c757d',
        textAlign: 'center',
    },
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
        }

        const formatDate = (days: number) => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date.toLocaleDateString('pt-BR');
        };

        const formatCurrency = (value: number) => {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        const BudgetPdfDocument = (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        {logoSrc && (
                            <View style={styles.logoContainer}>
                                <Image src={logoSrc} style={styles.logo} />
                            </View>
                        )}
                        <Text style={styles.headerText}>
                            ORÇAMENTO {budget.name}/{new Date().getFullYear()}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Informações do Cliente</Text>
                        <View style={styles.row}>
                            <Text style={styles.columnLeft}>Cliente: {budget.customer.name}</Text>
                            <Text style={styles.columnRight}>Fone: {budget.customer.phone}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Detalhes do Orçamento</Text>
                        {budget.categories.map((category, index) => (
                            <View key={index} style={styles.categoryItem}>
                                <Text style={styles.categoryName}>• {category.name}</Text>
                                {category.products.map((product, productIndex) => (
                                    <View key={productIndex} style={styles.productItem}>
                                        <Text style={styles.columnLeft}>- {product.name}</Text>
                                        <Text style={styles.columnRight}>{formatCurrency(product.price)}</Text>
                                    </View>
                                ))}
                                <View style={[styles.row, { marginTop: 5 }]}>
                                    <Text style={styles.columnLeft}>Subtotal {category.name}</Text>
                                    <Text style={styles.columnRight}>
                                        {formatCurrency(category.products.reduce((sum, product) => sum + product.price, 0))}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={[styles.section, styles.totalSection]}>
                        <View style={styles.row}>
                            <Text style={[styles.columnLeft, styles.totalText]}>Total do Orçamento</Text>
                            <Text style={[styles.columnRight, styles.totalText]}>{formatCurrency(budget.total)}</Text>
                        </View>
                    </View>

                    {budget.user.setting[0].paymentMethod && <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Condições de Pagamento</Text>
                        <Text>
                            {budget.user.setting[0].paymentMethod}
                        </Text>
                    </View>}

                    {budget.user.setting[0].observation && <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Observações</Text>
                        <Text style={{ color: 'red' }}>
                            {budget.user.setting[0].observation}
                        </Text>
                    </View>}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Prazos</Text>
                        {budget.user.setting[0].deliveryTimeDays && <View style={styles.row}>
                            <Text style={styles.columnLeft}>Prazo de entrega:</Text>
                            <Text style={styles.columnRight}>{formatDate(budget.user.setting[0].deliveryTimeDays)}</Text>
                        </View>}
                        {budget.user.setting[0].budgetValidityDays !== null && <View style={styles.row}>
                            <Text style={styles.columnLeft}>Validade deste orçamento:</Text>
                            <Text style={styles.columnRight}>{formatDate(budget.user.setting[0].budgetValidityDays)}</Text>
                        </View>}
                    </View>

                    <Text style={styles.footer}>
                        Este documento é uma simulação de orçamento e não possui valor fiscal.
                    </Text>
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