import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ArrayAnimal {
  name: string;
  number: string;
  icon?: string;
  translation?: string;
}

export interface LaoAnimalListProps {
  animals: (string | ArrayAnimal)[];
}

export function LaoAnimalList({ animals }: LaoAnimalListProps) {
  const { t, language } = useLanguage();

  if (!animals || animals.length === 0) return null;

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-800/60">
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-4 dark:border-white/10 dark:bg-neutral-800/80">
        <h3 className="text-fs-base font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Lao Animals / นามสัตว์
        </h3>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {animals.map((animalObj, i) => {
            const isStr = typeof animalObj === 'string';
            const name = isStr ? animalObj : animalObj.name;
            const num = isStr ? '' : animalObj.number;
            const icon = isStr ? '' : animalObj.icon;
            
            // Try translating the name if language is not EN
            const translatedName = !isStr && animalObj.translation && language !== 'en' 
              ? animalObj.translation 
              : name;

            return (
              <div
                key={i}
                className="group flex flex-col items-center justify-center min-w-[5rem] rounded-xl border border-rose-500/20 bg-rose-50/50 p-4 shadow-sm transition-all hover:scale-105 hover:bg-rose-50 hover:shadow-md dark:border-rose-500/10 dark:bg-rose-500/5 dark:hover:bg-rose-500/10"
              >
                {icon && (
                  <span className="mb-2 text-3xl drop-shadow-sm transition-transform group-hover:-translate-y-1">
                    {icon}
                  </span>
                )}
                <span className="text-sm font-bold tracking-wide text-gray-800 dark:text-gray-100 mb-1 text-center">
                  {translatedName}
                </span>
                {num && (
                  <div className="flex bg-rose-100 dark:bg-rose-900/50 rounded text-rose-600 dark:text-rose-300 font-mono font-bold text-lg leading-none px-3 py-1">
                    {num}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
