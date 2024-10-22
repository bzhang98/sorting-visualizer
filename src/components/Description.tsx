import { ArrowUpRight } from "lucide-react";

interface DescriptionProps {
  description: {
    description: string;
    link: string;
    timeComplexity: string;
    spaceComplexity: string;
    stability: string;
  };
}

export default function Description({ description }: DescriptionProps) {
  return (
    <div className="text-lg mt-8 p-2">
      <p className="mb-4">{description.description}</p>
      <a
        href={description.link}
        target="_blank"
        className="flex gap-2 items-center mb-8 hover:underline"
      >
        <img
          src="/icons/typescript.svg"
          alt="typescript icon"
          width={50}
          className="rounded-md"
        />
        See the implementation in Typescript <ArrowUpRight size={24} />
      </a>
      <ul>
        <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
          <strong>Time Complexity:</strong> {description.timeComplexity}
        </li>
        <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
          <strong>Space Complexity:</strong> {description.spaceComplexity}
        </li>
        <li className="py-4 border-t-2 border-b-2 grid grid-cols-[12rem_1fr]">
          <strong>Stable:</strong> {description.stability}
        </li>
      </ul>
    </div>
  );
}
