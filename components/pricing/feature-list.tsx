import { memo } from "react";
import { Check } from "lucide-react";
interface FeatureListProps {
  features: Array<{ text: string }>;
}

export const FeatureList = memo(function FeatureList({
  features,
}: FeatureListProps) {
  return (
    <div>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 group">
            <Check
              className="size-[18px] flex-shrink-0 text-blue-700 mt-0.5 transition-transform group-hover:scale-110"
              aria-hidden="true"
              strokeWidth={2.5}
            />
            <span className="text-sm text-neutral-600 font-inter leading-relaxed">
              {feature.text.startsWith("Manage") ? (
                <>
                  Manage{" "}
                  <span className="text-base font-bold">
                    {feature.text.match(/\d+/)?.[0] || ""}
                  </span>
                  {feature.text.slice(
                    (feature.text.match(/\d+/)?.[0]?.length || 0) + 7,
                  )}
                </>
              ) : (
                feature.text
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});
