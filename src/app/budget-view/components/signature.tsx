'use strict';

interface SignatureProps {
    companyName: string
    responsiblePerson: string
    phone: string
}

export default function Signature({ companyName, responsiblePerson, phone }: SignatureProps) {
    return (
        <div className="text-center space-y-2 pt-20 px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-300 w-full sm:w-2/3 mx-auto my-4"></div>
            <p className="text-sm sm:text-base lg:text-lg">{companyName}</p>
            <p className="text-sm sm:text-base lg:text-lg">{responsiblePerson}</p>
            <p className="text-sm sm:text-base lg:text-lg">{phone}</p>
        </div>
    );
}
