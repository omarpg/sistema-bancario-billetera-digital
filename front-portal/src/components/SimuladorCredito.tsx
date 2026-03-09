import { useState } from 'react';

interface SimulacionResultado {
  cuotaMensual: number;
  totalAPagar: number;
  cae: number;
  ctc: number;
}

export default function SimuladorCredito() {
  const [monto, setMonto] = useState(1000000);
  const [plazo, setPlazo] = useState(12);
  const [tasaAnual, setTasaAnual] = useState(12);
  const [resultado, setResultado] = useState<SimulacionResultado | null>(null);

  const calcularSimulacion = () => {
    // Tasa mensual
    const tasaMensual = tasaAnual / 100 / 12;

    // Cuota mensual usando fórmula de amortización francesa
    const cuotaMensual = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) /
      (Math.pow(1 + tasaMensual, plazo) - 1);

    // Total a pagar
    const totalAPagar = cuotaMensual * plazo;

    // CTC (Costo Total del Crédito)
    const ctc = totalAPagar - monto;

    // CAE (Carga Anual Equivalente) - simplificado
    // En la realidad incluye seguros y comisiones
    const cae = (Math.pow(1 + tasaMensual, 12) - 1) * 100;

    setResultado({
      cuotaMensual,
      totalAPagar,
      cae,
      ctc
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Simulador de Crédito
      </h2>

      <div className="space-y-6">
        {/* Monto */}
        <div>
          <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-2">
            Monto solicitado
          </label>
          <input
            id="monto"
            type="range"
            min="500000"
            max="5000000"
            step="100000"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">$500.000</span>
            <span className="text-lg font-semibold text-primary-600">
              {formatCurrency(monto)}
            </span>
            <span className="text-sm text-gray-600">$5.000.000</span>
          </div>
        </div>

        {/* Plazo */}
        <div>
          <label htmlFor="plazo" className="block text-sm font-medium text-gray-700 mb-2">
            Plazo (meses)
          </label>
          <select
            id="plazo"
            value={plazo}
            onChange={(e) => setPlazo(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="12">12 meses</option>
            <option value="24">24 meses</option>
            <option value="36">36 meses</option>
            <option value="48">48 meses</option>
            <option value="60">60 meses</option>
          </select>
        </div>

        {/* Tasa de interés */}
        <div>
          <label htmlFor="tasaAnual" className="block text-sm font-medium text-gray-700 mb-2">
            Tasa de interés anual
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="tasaAnual"
              type="number"
              min="1"
              max="50"
              step="0.1"
              value={tasaAnual}
              onChange={(e) => setTasaAnual(Number(e.target.value))}
              className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-gray-700">%</span>
          </div>
        </div>

        {/* Botón calcular */}
        <button
          onClick={calcularSimulacion}
          className="w-full btn-primary text-lg cursor-pointer"
        >
          Calcular
        </button>

        {/* Resultados */}
        {resultado && (
          <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Resultados de la simulación
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Cuota mensual</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(resultado.cuotaMensual)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total a pagar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(resultado.totalAPagar)}
                </p>
              </div>

              <div className="bg-secondary-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">CAE</p>
                <p className="text-2xl font-bold text-secondary-600">
                  {resultado.cae.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Carga Anual Equivalente
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">CTC</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(resultado.ctc)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Costo Total del Crédito
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Importante:</strong> Esta simulación es referencial.
                El CAE incluye la tasa de interés más todos los gastos y comisiones
                según la Ley N° 20.555.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}