
import { getUserCustomers } from "@/services/api/customer/actions";
import { CustomerDataTable } from "./components/customer-data-table";

export default async function Page() {
    const customers = await getUserCustomers()

    return <CustomerDataTable data={customers} />;
}
