
interface Product {
  name: string
  price: number
}

interface Category {
  name: string
  products: Product[]
}

interface CategoriesProps {
  categories: Category[]
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <div key={index} className="border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">{category.name.toUpperCase()}</h2>
          {category.products.map((product, idx) => (
            <div key={idx} className="flex justify-between">
              <span>• {product.name}</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
            </div>
          ))}
          <div className="text-right font-semibold mt-2">
            Total {category.name}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(category.products.reduce((sum, prod) => sum + prod.price, 0))}
          </div>
        </div>
      ))}
    </div>
  )
}
