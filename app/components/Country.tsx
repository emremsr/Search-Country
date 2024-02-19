import React, { useEffect, useState } from "react";

interface CountryProps {
  country: any;
  isSelected: boolean;
  handleCheckboxChange: (countryName: string) => void;
  backgroundColor:string;
}

const Country: React.FC<CountryProps> = ({
  country,
  isSelected,
  handleCheckboxChange,
}) => {
  const [localSelected, setLocalSelected] = useState(isSelected);

  useEffect(() => {
    setLocalSelected(isSelected);
  }, [isSelected]);

  const handleCheckbox = () => {
    setLocalSelected(!localSelected);
    handleCheckboxChange(country.name);
  };

  const backgroundColor = localSelected
    ? `#${Math.floor(Math.random() * 16777215).toString(16)}`
    : "#ffffff";

  return (
    <div
      className={`country-item ${
        localSelected ? "selected" : ""
      }  transition-all duration-500 ease-in-out transform hover:shadow-2xl px-3 py-2 cursor-pointer 
      sm:flex-col md:flex-row lg:flex-row xl:flex-row`}
      onClick={handleCheckbox}
      style={{ backgroundColor }}
    >
      <div className="flex items-center justify-between w-full">
        <p className="font-bold">{country.name}</p>
        <p className="sm:hidden">{country.native}</p>
      </div>
      <div className="hidden sm:flex items-center justify-between">
        <p>{country.capital}</p>
        <p>{country.currency}</p>
      </div>
      <div className="hidden md:flex items-center justify-between">
        <p>{country.emoji}</p>
        <div className="flex items-center gap-1">
          {country.languages.map((language: any) => (
            <p key={language.code}>{language.name}</p>
          ))}
        </div>
      </div>
      <input type="checkbox" checked={isSelected} onChange={handleCheckbox} />
    </div>
  );
};

export default Country;
