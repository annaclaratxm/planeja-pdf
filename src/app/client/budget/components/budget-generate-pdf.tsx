/* eslint-disable jsx-a11y/alt-text */
'use client';

import { generatePdf } from '@/services/api/pdf-generator/actions';
import { GetFileFromR2 } from '@/services/bucket/cloudflare';
import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        backgroundColor: '#FFFFFF',
        color: '#333333',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a3a5a',
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a3a5a',
        marginBottom: 5,
    },
    item: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemText: {
        width: '80%',
    },
    itemValue: {
        width: '20%',
        textAlign: 'right',
    },
    totalSection: {
        paddingTop: 5,
    },
    totalText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a3a5a',
        textAlign: 'right',
    },
    notesSection: {
        marginTop: 15,
        padding: 10,
    },
    notesText: {
        fontSize: 10,
        color: '#555555',
        lineHeight: 1.5,
    },
    assinature: {
        textAlign: 'center',
        fontSize: 10,
        color: '#333333',
    },
    assinatureLine: {
        borderTop: 1,
        borderTopWidth: 2,
        borderTopColor: '#000000'
    },
    footer: {
        fontSize: 10,
        textAlign: 'center',
        color: '#333333',
    },
    signatureLine: {
        marginVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        width: '70%',
        alignSelf: 'center',
        paddingBottom: 5,
    },
    signatureText: {
        fontSize: 10,
        textAlign: 'center',
        color: '#333333',
        marginTop: 5,
    }, columnLeft: {
        width: '60%',
    },
    columnRight: {
        width: '35%',
        textAlign: 'right',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
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

        const formatCurrency = (value: number) =>
            value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const BudgetPdfDocument = (
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* Header */}
                    <View style={styles.header}>
                        {logoSrc && (
                            <Image
                                src={logoSrc}
                                style={{
                                    maxHeight: 160,
                                    maxWidth: 160,
                                    objectFit: 'contain',
                                    alignSelf: 'center',
                                }}
                            />
                        )}
                        <Text style={styles.headerText}>ORÇAMENTO / {new Date().getFullYear()}</Text>
                    </View>

                    {/* Customer Info */}
                    <View style={styles.section}>
                        <Text>Cliente: {budget.customer.name}</Text>
                        <Text>Fone: {budget.customer.phone}</Text>
                    </View>

                    {/* Budget Details */}
                    {budget.categories.map((category, index) => (
                        <View key={index} style={styles.section}>
                            <Text style={styles.sectionTitle}>{category.name.toUpperCase()}</Text>
                            {category.products.map((product, idx) => (
                                <View key={idx} style={styles.item}>
                                    <Text style={styles.itemText}>{`• ${product.name}`}</Text>
                                    <Text style={styles.itemValue}>{formatCurrency(product.price)}</Text>
                                </View>
                            ))}
                            <Text style={styles.totalText}>
                                Total {category.name}: {formatCurrency(category.products.reduce((sum, prod) => sum + prod.price, 0))}
                            </Text>
                        </View>
                    ))}

                    {/* General Total */}
                    <View style={styles.totalSection}>
                        <Text style={styles.totalText}>Total geral do orçamento: {formatCurrency(budget.total)}</Text>
                    </View>

                    {/* Payment and Notes */}
                    {budget.user.setting[0].paymentMethod && (
                        <View style={styles.notesSection}>
                            <Text>Formas de pagemento</Text>
                            <Text style={styles.notesText}>
                                {budget.user.setting[0].paymentMethod}
                            </Text>
                        </View>
                    )}

                    {budget.user.setting[0].observation && (
                        <View style={styles.notesSection}>
                            <Text>Observações</Text>
                            <Text style={styles.notesText}>{budget.user.setting[0].observation}</Text>
                        </View>
                    )}

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

                    <View style={{ padding: 20 }} />
                    <View style={styles.signatureLine} />

                    <View style={styles.assinature} >
                        <Text>{budget.user.setting[0].companyName}</Text>
                        <Text>{budget.user.setting[0].responsiblePerson}</Text>
                        <Text>{budget.user.setting[0].phone}</Text>
                    </View>

                    {/* Footer */}
                    <View style={[styles.footer, { position: 'absolute', bottom: 40, left: 40, right: 40 }]} fixed>
                        <Text>
                            {`${budget.user.setting[0].street}, ${budget.user.setting[0].number}, ${budget.user.setting[0].neighborhood} - ${budget.user.setting[0].city} - ${budget.user.setting[0].state.toUpperCase()} / CEP ${budget.user.setting[0].zipCode}`}
                        </Text>
                        <Text>{`CNPJ: ${budget.user.setting[0].cnpj}`}</Text>
                    </View>

                </Page>
            </Document>
        );

        const blob = await pdf(BudgetPdfDocument).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${budget.customer.name}-${budget.name}-${new Date().getFullYear()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
