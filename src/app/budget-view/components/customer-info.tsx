'use strict';

interface CustomerInfoProps {
  name: string
  phone: string
}

export default function CustomerInfo({ name, phone }: CustomerInfoProps) {
  return (
    <div className="border-b pb-4 md:flex md:justify-between">
      <p className="md:w-1/2"><strong>Cliente:</strong> {name}</p>
      <p className="md:w-1/2"><strong>Fone:</strong> {phone}</p>
    </div>
  );
}