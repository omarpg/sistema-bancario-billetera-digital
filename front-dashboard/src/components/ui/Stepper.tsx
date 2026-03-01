interface Step {
  number: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Círculo del paso */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep >= step.number
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {currentStep > step.number ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <p className={`text-sm mt-2 font-medium ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                }`}>
                {step.title}
              </p>
            </div>

            {/* Línea conectora */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 rounded transition-colors ${currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}