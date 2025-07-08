import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, FileText, ImageIcon, Percent } from 'lucide-react';

export function ValuationAccuracyInfo() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Få en Mer Exakt Värdering
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Vår AI-värderingstjänst blir bättre med mer information. Ju fler detaljer du anger, desto träffsäkrare blir resultatet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <FileText className="h-10 w-10 text-blue-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Detaljerad Beskrivning</h3>
              <p className="text-gray-600 text-sm">
                Beskriv föremålets skick, material, märke, ålder och eventuell historik. Varje detalj hjälper AI:n att göra en korrekt bedömning.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <ImageIcon className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tydliga Foton</h3>
              <p className="text-gray-600 text-sm">
                Ladda upp flera, välbelysta bilder från olika vinklar. Visa eventuella skador, stämplar eller unika kännetecken.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <Percent className="h-10 w-10 text-purple-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Högre Konfidens</h3>
              <p className="text-gray-600 text-sm">
                Mer data leder till en högre konfidensnivå i värderingen, vilket ger dig en starkare indikation på föremålets potentiella marknadsvärde.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
            <p className="text-md text-gray-700">
                Kom ihåg: <strong>Ju mer information och bilder AI:n får, desto mer % rätt värdering får man.</strong>
            </p>
        </div>
      </div>
    </section>
  );
}
