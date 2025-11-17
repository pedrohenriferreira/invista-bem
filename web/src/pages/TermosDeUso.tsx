import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, ArrowLeft, FileText, Shield, AlertCircle, Scale } from "lucide-react";

const TermosDeUso = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-financial-gradient p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invista Bem</h1>
                <p className="text-sm text-gray-600">Termos de Uso</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-gray-700 hover:text-financial-blue"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-financial-blue" />
                <div>
                  <CardTitle className="text-3xl">Termos de Uso</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    Última atualização: 16 de novembro de 2025
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  {/* Introdução */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <AlertCircle className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">1. Introdução</h2>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>
                        Bem-vindo ao <strong>Invista Bem</strong>! Estes Termos de Uso ("Termos") 
                        regem o acesso e uso da plataforma Invista Bem, um simulador de investimentos 
                        em renda fixa que utiliza dados reais do Banco Central do Brasil.
                      </p>
                      <p>
                        Ao criar uma conta ou utilizar nossos serviços, você concorda em cumprir e 
                        estar vinculado a estes Termos. Se você não concordar com qualquer parte 
                        destes Termos, não poderá acessar ou usar nossos serviços.
                      </p>
                    </div>
                  </section>

                  {/* Definições */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">2. Definições</h2>
                    </div>
                    <div className="space-y-3 text-gray-700">
                      <p><strong>"Plataforma"</strong>: refere-se ao site e aplicação Invista Bem.</p>
                      <p><strong>"Usuário"</strong>: qualquer pessoa que acesse ou utilize a Plataforma.</p>
                      <p><strong>"Simulação"</strong>: cálculo estimado de investimentos realizado pela Plataforma.</p>
                      <p><strong>"Dados do BCB"</strong>: informações fornecidas pela API pública do Banco Central do Brasil.</p>
                    </div>
                  </section>

                  {/* Serviços Oferecidos */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">3. Serviços Oferecidos</h2>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>O Invista Bem oferece:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Simulador de investimentos em renda fixa (CDI, CDB, Tesouro Selic, LCI/LCA, Poupança)</li>
                        <li>Indicadores financeiros atualizados (Selic, CDI, Poupança, IPCA)</li>
                        <li>Gráficos de evolução de investimentos</li>
                        <li>Comparação entre diferentes modalidades de investimento</li>
                        <li>Histórico pessoal de simulações (armazenado localmente)</li>
                      </ul>
                    </div>
                  </section>

                  {/* Natureza Educacional */}
                  <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                      <div className="space-y-3 text-gray-800">
                        <h2 className="text-xl font-bold text-yellow-900">4. Natureza Educacional - Aviso Importante</h2>
                        <p className="font-semibold">
                          A Plataforma Invista Bem tem caráter EXCLUSIVAMENTE EDUCACIONAL e informativo.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>NÃO oferecemos consultoria financeira ou de investimentos</li>
                          <li>NÃO somos uma instituição financeira autorizada</li>
                          <li>NÃO intermediamos operações financeiras</li>
                          <li>NÃO garantimos rentabilidade ou resultados</li>
                          <li>As simulações são estimativas e NÃO representam garantia de retorno</li>
                        </ul>
                        <p className="font-semibold text-yellow-900 mt-4">
                          Recomendamos fortemente que você consulte um profissional certificado antes 
                          de tomar qualquer decisão de investimento.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Responsabilidades do Usuário */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">5. Responsabilidades do Usuário</h2>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>Ao utilizar a Plataforma, você concorda em:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
                        <li>Manter a confidencialidade de suas credenciais de acesso</li>
                        <li>Utilizar a Plataforma apenas para fins lícitos e educacionais</li>
                        <li>Não tentar acessar áreas restritas ou violar a segurança da Plataforma</li>
                        <li>Não reproduzir, distribuir ou comercializar conteúdo da Plataforma sem autorização</li>
                        <li>Tomar suas próprias decisões de investimento baseadas em análise pessoal</li>
                      </ul>
                    </div>
                  </section>

                  {/* Limitação de Responsabilidade */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <Scale className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">6. Limitação de Responsabilidade</h2>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>
                        O Invista Bem não se responsabiliza por:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Perdas financeiras resultantes de decisões baseadas em simulações da Plataforma</li>
                        <li>Imprecisões nos dados fornecidos por fontes externas (incluindo API do BCB)</li>
                        <li>Interrupções temporárias ou permanentes do serviço</li>
                        <li>Erros de cálculo decorrentes de dados incorretos inseridos pelo usuário</li>
                        <li>Alterações nas condições de mercado após a realização das simulações</li>
                        <li>Incompatibilidade de navegadores ou dispositivos</li>
                      </ul>
                      <p className="font-semibold mt-4">
                        A Plataforma é fornecida "COMO ESTÁ" e "CONFORME DISPONÍVEL", sem garantias 
                        de qualquer tipo, expressas ou implícitas.
                      </p>
                    </div>
                  </section>

                  {/* Propriedade Intelectual */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">7. Propriedade Intelectual</h2>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>
                        Todo o conteúdo da Plataforma, incluindo mas não limitado a textos, gráficos, 
                        logos, ícones, imagens, código-fonte e software, é propriedade do Invista Bem 
                        ou de seus licenciadores e está protegido por leis de direitos autorais.
                      </p>
                      <p>
                        É proibida a reprodução, distribuição, modificação ou uso comercial do conteúdo 
                        sem autorização prévia por escrito.
                      </p>
                    </div>
                  </section>

                  {/* Privacidade */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">8. Privacidade e Proteção de Dados</h2>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>
                        A coleta e uso de dados pessoais são regidos por nossa Política de Privacidade, 
                        que está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                      </p>
                      <p>
                        Destacamos que:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Simulações são armazenadas localmente no navegador (localStorage)</li>
                        <li>Não compartilhamos dados pessoais com terceiros sem consentimento</li>
                        <li>Utilizamos medidas de segurança para proteger suas informações</li>
                        <li>Você pode solicitar a exclusão de seus dados a qualquer momento</li>
                      </ul>
                    </div>
                  </section>

                  {/* Modificações */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <AlertCircle className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">9. Modificações dos Termos</h2>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>
                        Reservamo-nos o direito de modificar estes Termos a qualquer momento. 
                        Alterações significativas serão notificadas através da Plataforma ou por e-mail.
                      </p>
                      <p>
                        O uso continuado da Plataforma após as modificações constitui aceitação dos 
                        novos Termos.
                      </p>
                    </div>
                  </section>

                  {/* Rescisão */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <Scale className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">10. Rescisão</h2>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>
                        Podemos suspender ou encerrar seu acesso à Plataforma imediatamente, 
                        sem aviso prévio, em caso de violação destes Termos.
                      </p>
                      <p>
                        Você pode encerrar sua conta a qualquer momento através das configurações 
                        da Plataforma ou entrando em contato conosco.
                      </p>
                    </div>
                  </section>

                  {/* Lei Aplicável */}
                  <section>
                    <div className="flex items-center space-x-2 mb-4">
                      <Scale className="h-5 w-5 text-financial-blue" />
                      <h2 className="text-2xl font-bold text-gray-900">11. Lei Aplicável e Jurisdição</h2>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>
                        Estes Termos são regidos pelas leis da República Federativa do Brasil.
                      </p>
                      <p>
                        Quaisquer disputas relacionadas a estes Termos serão submetidas à jurisdição 
                        exclusiva dos tribunais brasileiros.
                      </p>
                    </div>
                  </section>

                  {/* Aceitação */}
                  <section className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border-2 border-financial-blue">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Aceitação dos Termos</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Ao clicar em "Aceito os Termos de Uso" durante o cadastro ou ao continuar 
                      utilizando a Plataforma, você declara que leu, compreendeu e concorda em 
                      estar vinculado a estes Termos de Uso.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={() => {
                window.print();
              }}
              className="flex-1 bg-financial-gradient hover:opacity-90 text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Imprimir/Salvar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermosDeUso;
