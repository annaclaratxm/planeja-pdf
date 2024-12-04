'use strict';

interface SignatureProps {
    companyName: string
    responsiblePerson: string
    phone: string
}

export default function Signature({ companyName, responsiblePerson, phone }: SignatureProps) {
    return (
        <div className="text-center space-y-2 pt-20">
            <div className="border-t border-gray-300 w-2/3 mx-auto my-4"></div>
            <p>{companyName}</p>
            <p>{responsiblePerson}</p>
            <p>{phone}</p>
        </div>
    );
}
