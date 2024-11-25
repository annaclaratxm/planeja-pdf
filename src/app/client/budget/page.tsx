import { getBudgets } from "@/services/api/budget/actions";
import BudgetDataTable from "./components/budget-data-table";

export default async function BudgetPage() {
    const budgets = await getBudgets();
    const mappedBudgets = budgets.map(budget => ({
        ...budget,
        shippingDate: budget.shippingDate ? new Date(budget.shippingDate).toString() : ''
    }));

    return <BudgetDataTable budgets={mappedBudgets} />;
}