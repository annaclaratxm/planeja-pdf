import { getBudgets } from "@/services/api/budget/actions";
import BudgetDataTable from "./components/budget-data-table";

export default async function BudgetPage() {
    const budgets = await getBudgets();
    const mappedBudgets = budgets.map(budget => ({
        ...budget,
        shippingDate: budget.shippingDate ? new Date(budget.shippingDate).toString() : ''
    }));

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <BudgetDataTable budgets={mappedBudgets} />
        </div>
    );
}