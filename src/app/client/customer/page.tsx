import { getUserCustomers } from "@/services/api/customer/actions";
import { CustomerDataTable } from "./components/customer-data-table";

export default async function Page() {
    const customers = await getUserCustomers()

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <CustomerDataTable data={customers} />
        </div>
    );
}
