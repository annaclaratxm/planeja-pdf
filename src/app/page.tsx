'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Award, CheckCircle, Clock, FileOutput, FileText, PieChart, Settings, TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

export default function LandingPage() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-white overflow-hidden" ref={targetRef}>
      <motion.header
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <nav className="flex justify-between items-center">
          <motion.div
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            PlanejaPdf
          </motion.div>
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Entrar
            </Link>
          </motion.div>
        </nav>
      </motion.header>

      <main className="container mx-auto px-4 py-16">
        <motion.section
          className="text-center mb-24"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            variants={fadeInUp}
          >
            Revolucione seus Orçamentos com PlanejaPdf
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Cadastre clientes, configure orçamentos e emita PDFs profissionais em questão de minutos. Simplifique seu fluxo de trabalho e aumente sua produtividade hoje!
          </motion.p>
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/auth"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Comece Gratuitamente
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight />
              </motion.div>
            </Link>
          </motion.div>
        </motion.section>

        <motion.section
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {[
            { icon: Users, title: "Gestão de Clientes", description: "Organize e gerencie sua base de clientes com facilidade. Mantenha todos os dados importantes em um só lugar." },
            { icon: Settings, title: "Personalização Avançada", description: "Adapte os orçamentos para refletir sua marca e necessidades específicas. Crie templates personalizados." },
            { icon: FileText, title: "Orçamentos Inteligentes", description: "Crie orçamentos detalhados e profissionais em minutos. Use recursos de automação para agilizar o processo." },
            { icon: FileOutput, title: "PDFs Profissionais", description: "Gere documentos de alta qualidade prontos para impressão ou envio digital. Impressione seus clientes com apresentações impecáveis." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[#132236] p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="mx-auto mb-6 h-16 w-16 text-blue-400">
                <feature.icon className="h-full w-full" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          className="text-center mb-24"
          style={{ opacity, scale }}
        >
          <motion.h2
            className="text-4xl font-bold mb-12"
            variants={fadeInUp}
          >
            Por que o PlanejaPDF é a Escolha Certa?
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-12"
            variants={staggerChildren}
          >
            {[
              { icon: Zap, title: "Eficiência Máxima", description: "Reduza o tempo gasto em orçamentos em até 70% com nosso processo otimizado. Automatize tarefas repetitivas e foque no que realmente importa." },
              { icon: CheckCircle, title: "Profissionalismo Elevado", description: "Impressione seus clientes com orçamentos visualmente atraentes e bem estruturados. Nossos templates profissionais garantem uma apresentação impecável." },
              { icon: Clock, title: "Flexibilidade Total", description: "Adapte-se a qualquer projeto com nossas opções de personalização abrangentes. Crie orçamentos sob medida para cada cliente e situação." },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#1d3a5f] p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mx-auto mb-6 h-16 w-16 text-green-400">
                  <item.icon className="h-full w-full" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>



        <div className="container mx-auto px-4">
          <motion.h2
            className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400"
            variants={{
              initial: { opacity: 0, y: 50 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            Como o PlanejaPDF Revoluciona seu Negócio
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                icon: Zap,
                title: "Turbine sua Produtividade",
                description: "Reduza o tempo de criação de orçamentos em até 80%. Foque em fechar negócios, não em papelada.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: TrendingUp,
                title: "Aumente suas Conversões",
                description: "Orçamentos profissionais e personalizados impressionam clientes e aumentam suas chances de fechar negócios.",
                color: "from-green-400 to-emerald-600"
              },
              {
                icon: PieChart,
                title: "Análise de Desempenho",
                description: "Acompanhe o sucesso de seus orçamentos e identifique oportunidades de melhoria com nossos relatórios detalhados.",
                color: "from-blue-400 to-indigo-600"
              },
              {
                icon: Award,
                title: "Destaque-se da Concorrência",
                description: "Ofereça uma experiência superior aos seus clientes com orçamentos claros, detalhados e visualmente atraentes.",
                color: "from-purple-400 to-pink-500"
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#1d3a5f] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                variants={{
                  initial: { opacity: 0, y: 50 },
                  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
              >
                <div className={`mb-6 p-4 rounded-full inline-block bg-gradient-to-br ${item.color}`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.section
          className="py-24 bg-[url('/favicon.ico')] bg-cover bg-center relative"
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: 0.8 } }
          }}
        >
          <div className="absolute inset-0 bg-[#0a192f] bg-opacity-90"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              variants={{
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              <h2 className="text-5xl font-bold mb-8 leading-tight">
                Pronto para Revolucionar seus Orçamentos?
              </h2>
              <p className="text-xl mb-12 text-gray-300">
                Junte-se a milhares de profissionais que já estão economizando tempo,
                fechando mais negócios e transformando suas empresas com o PlanejaPDF.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row justify-center items-center gap-4"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } }
                }}
              >
                <Link
                  href="/auth"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Comece Gratuitamente
                  <ArrowRight className="ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <motion.footer
        className="bg-[#0d1b2a] py-12 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="mb-4">&copy; 2024 PlanejaPDF. Transformando a maneira como você cria orçamentos.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="/" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <Link href="/" className="hover:text-white transition-colors">Contato</Link>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

