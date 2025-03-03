"use client";

import { memo, useCallback, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Slider } from "@/components/ui/slider";
import type { PricingTier } from "@/types/pricing";
import { cn } from "@/lib/utils";

interface ClientSelectorProps {
  tier: PricingTier;
  clientCount: number;
  onClientCountChange: (value: number) => void;
  highlighted?: boolean;
}

const NumberInput = memo(function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  highlighted,
  name,
}: {
  id: string;
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  highlighted?: boolean;
  name: string;
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalValue(Number(newValue));
    onChange(event);
  };

  const handleBlur = () => {
    // Ensure the value is within bounds when leaving the input
    const numValue = Number(localValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, min), max);
      if (clampedValue !== localValue) {
        setLocalValue(clampedValue);
        // Create a synthetic event to trigger the onChange
        const event = {
          target: { value: String(clampedValue) },
        } as ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    }
  };

  return (
    <input
      id={id}
      type="number"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn(
        "w-[5.25rem] h-11 font-lexend text-center text-lg font-bold rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:ml-1.5 [&::-webkit-outer-spin-button]:ml-1.5 px-3",
        highlighted
          ? "bg-white text-blue-700 border-blue-200 hover:border-blue-300"
          : "border-neutral-200 text-neutral-700 hover:border-neutral-300",
      )}
      min={min}
      max={max}
      aria-label={`Number of clients for ${name}`}
    />
  );
});

const ClientLabel = memo(function ClientLabel({
  htmlFor,
  highlighted,
}: {
  htmlFor: string;
  highlighted?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-base font-semibold font-lexend block mb-3",
        highlighted ? "text-blue-700" : "text-neutral-700",
      )}
    >
      Select Number of Clients
    </label>
  );
});

export const ClientSelector = memo(function ClientSelector({
  tier,
  clientCount,
  onClientCountChange,
  highlighted,
}: ClientSelectorProps) {
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // Always use the actual input value, don't parse until we need to
      const inputValue = event.target.value;

      // If empty, don't do anything
      if (inputValue === "") return;

      const value = Number.parseInt(inputValue, 10);
      if (!isNaN(value)) {
        // Simple clamping between min and max
        const clampedValue = Math.min(
          Math.max(value, tier.minClients),
          tier.maxClients,
        );
        onClientCountChange(clampedValue);
      }
    },
    [tier.minClients, tier.maxClients, onClientCountChange],
  );

  const handleSliderChange = useCallback(
    (value: number[]) => {
      onClientCountChange(value[0]);
    },
    [onClientCountChange],
  );

  const inputId = `clients-${tier.name}`;

  return (
    <div>
      <ClientLabel htmlFor={inputId} highlighted={highlighted} />
      <div className="flex items-center gap-4">
        <NumberInput
          id={inputId}
          value={clientCount}
          onChange={handleInputChange}
          min={tier.minClients}
          max={tier.maxClients}
          highlighted={highlighted}
          name={tier.name}
        />
        <Slider
          value={[clientCount]}
          onValueChange={handleSliderChange}
          max={tier.maxClients}
          min={tier.minClients}
          step={1}
          className="flex-1"
          highlighted={highlighted}
          aria-label={`Slider for number of clients in ${tier.name}`}
        />
      </div>
    </div>
  );
});
