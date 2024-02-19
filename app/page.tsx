"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Country from "./components/Country";
import "./globals.css";
import Link from "next/link";

const CountryList: React.FC = () => {
  const { data, isLoading, error } = useQuery("countries", fetchCountries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [lastCountryIndex, setLastCountryIndex] = useState<number | null>(null);

  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    let updatedData = data;

    if (searchQuery) {
      updatedData = data
        ?.filter(
          (country: any) =>
            country?.name &&
            country.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 10);
    }

    if (updatedData && updatedData.length > 0) {
      const lastCountry = updatedData[updatedData.length - 1];
      setSelectedCountry(lastCountry.name);
    }

    setFilteredData(updatedData);
  }, [data, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCheckboxChange = (countryName: string, index: number) => {
    if (selectedCountry === countryName) {
      setSelectedCountry(null);
      setLastCountryIndex(null);
    } else {
      setSelectedCountry(countryName);
      setLastCountryIndex(index);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <main>
      <nav className="bg-gray-800 text-white w-full fixed top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href={"/"} className="text-xl font-bold">
              KONZEK
            </Link>
            <div className="flex items-center w-[300px] rounded-lg py-3 px-5">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Enter Your Country..."
                className="w-full outline-none bg-transparent border px-4 py-2 hover:rounded-lg duration-700"
              />
            </div>
          </div>
        </div>
      </nav>
      <hr className="mb-28" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-3 md:px-2">
        {filteredData &&
          filteredData.map((country: any, index: number) => (
            <Country
              key={country.name}
              country={country}
              isSelected={selectedCountry === country.name}
              handleCheckboxChange={(countryName) =>
                handleCheckboxChange(countryName, index)
              }
              backgroundColor={
                lastCountryIndex === index ? "#00FF00" : "#ffffff"
              }
            />
          ))}
      </div>
    </main>
  );
};

const fetchCountries = async () => {
  const response = await fetch("https://countries.trevorblades.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          countries {
            name
            native
            capital
            emoji
            currency
            languages {
              code
              name
            }
          }
        }
      `,
    }),
  });

  const { data } = await response.json();
  return data.countries;
};

export default CountryList;
