import { ArrowRight, FileOutput, FileText, Settings, Users } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a192f] text-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold">PlanejaPdf</div>
          <div className="space-x-4">
            <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">Entrar</Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Simplifique seus Orçamentos com PlanejaPdf</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">Cadastre clientes, configure orçamentos e emita PDFs profissionais em minutos.</p>
          <Link
            href="/signup"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Comece Agora
            <ArrowRight className="ml-2" />
          </Link>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { icon: Users, title: "Cadastro de Clientes", description: "Gerencie facilmente sua base de clientes." },
            { icon: Settings, title: "Configurações Personalizadas", description: "Adapte os orçamentos às suas necessidades." },
            { icon: FileText, title: "Criação de Orçamentos", description: "Crie orçamentos detalhados e profissionais." },
            { icon: FileOutput, title: "Emissão de PDF", description: "Gere PDFs prontos para envio aos clientes." },
          ].map((feature, index) => (
            <div key={index} className="bg-[#132236] p-6 rounded-lg text-center">
              <feature.icon className="mx-auto mb-4 h-12 w-12 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Por que escolher PlanejaPdf?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Eficiência</h3>
              <p className="text-gray-300">Economize tempo com nosso processo simplificado de orçamento.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Profissionalismo</h3>
              <p className="text-gray-300">Impressione seus clientes com orçamentos bem apresentados.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Flexibilidade</h3>
              <p className="text-gray-300">Personalize seus orçamentos para atender às suas necessidades específicas.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para simplificar seus orçamentos?</h2>
          <Link
            href="/signup"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Experimente Gratuitamente
            <ArrowRight className="ml-2" />
          </Link>
        </section>
      </main>

      <footer className="bg-[#0d1b2a] py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 PlanejaPdf. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}