'use strict';

interface CustomerInfoProps {
  name: string
  phone: string
}

export default function CustomerInfo({ name, phone }: CustomerInfoProps) {
  return (
    <div className="border-b pb-4">
      <p><strong>Cliente:</strong> {name}</p>
      <p><strong>Fone:</strong> {phone}</p>
    </div>
  );
}