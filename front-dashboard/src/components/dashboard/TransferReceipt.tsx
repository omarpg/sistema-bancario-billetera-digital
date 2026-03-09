'use client';

import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { TransferReceiptData } from '@/types';

interface TransferReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  data: TransferReceiptData;
}

export default function TransferReceipt({ isOpen, onClose, data }: TransferReceiptProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generatePDF();
  };

  const generatePDF = () => {
    // Crear contenido HTML para el PDF
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Comprobante de Transferencia #${data.operationNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #059669;
          }
          .header h1 {
            color: #059669;
            margin: 0 0 10px 0;
          }
          .operation-number {
            background: #f0fdf4;
            border: 2px solid #059669;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 8px;
          }
          .operation-number .label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .operation-number .number {
            font-size: 28px;
            font-weight: bold;
            color: #059669;
          }
          .details {
            margin: 20px 0;
          }
          .detail-row {
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-size: 13px;
            color: #666;
            font-weight: 500;
          }
          .detail-value {
            font-size: 14px;
            color: #1f2937;
            font-weight: 600;
            text-align: right;
          }
          .amount {
            background: #f0fdf4;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            border-radius: 8px;
          }
          .amount .label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .amount .value {
            font-size: 32px;
            font-weight: bold;
            color: #059669;
          }
          .status {
            text-align: center;
            padding: 15px;
            background: #f0fdf4;
            border-radius: 8px;
            margin: 20px 0;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 20px;
            background: #059669;
            color: white;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✓ Transferencia Exitosa</h1>
          <p>Billetera Digital</p>
        </div>

        <div class="operation-number">
          <div class="label">Número de Operación</div>
          <div class="number">#${data.operationNumber}</div>
        </div>

        <div class="amount">
          <div class="label">Monto Transferido</div>
          <div class="value">${formatCurrency(data.amount)}</div>
        </div>

        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Fecha y hora</span>
            <span class="detail-value">${formatDateTime(data.date)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Cuenta origen</span>
            <span class="detail-value">${data.sourceAccountNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Destinatario</span>
            <span class="detail-value">${data.destinationName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Cuenta destino</span>
            <span class="detail-value">${data.destinationAccountNumber}</span>
          </div>
          ${data.description ? `
          <div class="detail-row">
            <span class="detail-label">Descripción</span>
            <span class="detail-value">${data.description}</span>
          </div>
          ` : ''}
        </div>

        <div class="status">
          <span class="status-badge">✓ Completada</span>
        </div>

        <div class="footer">
          <p><strong>Billetera Digital</strong></p>
          <p>Este documento es válido como comprobante de pago</p>
          <p>Generado el ${formatDateTime(new Date().toISOString())}</p>
        </div>
      </body>
      </html>
    `;

    // Crear blob y descargar
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprobante-transferencia-${data.operationNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Abrir en nueva ventana para que el usuario pueda imprimir como PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Ajustado para no exceder altura de pantalla */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col print:max-h-none print:shadow-none">
        {/* Header fijo */}
        <div className="shrink-0 text-center p-6 border-b border-gray-200 print:border-0">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Transferencia Exitosa</h2>
          <p className="text-gray-600 text-sm mt-1">Tu transferencia ha sido procesada</p>
        </div>

        {/* Contenido con scroll interno */}
        <div className="flex-1 overflow-y-auto p-6 print:overflow-visible">
          {/* Número de operación */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4 text-center">
            <p className="text-xs text-gray-600 mb-1">Número de Operación</p>
            <p className="text-2xl font-bold text-primary-700">#{data.operationNumber}</p>
          </div>

          {/* Detalles compactos */}
          <div className="space-y-3 mb-4">
            <div className="border-b border-gray-200 pb-3">
              <p className="text-xs text-gray-600">Fecha y hora</p>
              <p className="text-sm font-semibold text-gray-900">{formatDateTime(data.date)}</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <p className="text-xs text-gray-600">Monto transferido</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(data.amount)}</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <p className="text-xs text-gray-600">Cuenta origen</p>
              <p className="text-sm font-semibold text-gray-900">{data.sourceAccountNumber}</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <p className="text-xs text-gray-600">Destinatario</p>
              <p className="text-sm font-semibold text-gray-900">{data.destinationName}</p>
              <p className="text-xs text-gray-600 mt-1">{data.destinationAccountNumber}</p>
            </div>

            {data.description && (
              <div className="border-b border-gray-200 pb-3">
                <p className="text-xs text-gray-600">Descripción</p>
                <p className="text-sm font-medium text-gray-900">{data.description}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Estado</p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                ✓ Completada
              </span>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 print:hidden">
            💡 Puedes descargar o imprimir este comprobante para tus registros.
          </div>

          {/* Footer para impresión */}
          <div className="hidden print:block mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-600">
            <p>Billetera Digital - Comprobante de Transferencia</p>
            <p className="mt-1">Este documento es válido como comprobante de pago</p>
          </div>
        </div>

        {/* Botones de acción fijos al fondo */}
        <div className="shrink-0 p-4 border-t border-gray-200 print:hidden">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Imprimir</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Descargar</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}