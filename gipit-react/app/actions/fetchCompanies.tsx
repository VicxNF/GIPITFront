"use server";
import { Jefatura } from "@/app/lib/types";

export const fetchFirstCompany = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/company/first`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  return response;
};

export const fetchAllCompanies = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/company`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las compañías");
    }

    const companiesList = await response.json();
    return companiesList;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error al obtener las compañías: ${
          error.message || "Error desconocido"
        }`
      );
    } else {
      throw new Error("Error desconocido al obtener las compañías");
    }
  }
};

interface Company {
  id: number;
  name: string;
}

export const fetchListCompanies = async (): Promise<
  { id: number; name: string }[]
> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/company`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las compañías");
    }

    const companiesList: Company[] = await response.json();

    const formattedCompanies = companiesList.map((company: Company) => ({
      id: company.id,
      name: company.name,
    }));

    return formattedCompanies;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error al obtener la lista de compañías: ${
          error.message || "Error desconocido"
        }`
      );
    } else {
      throw new Error("Error desconocido al obtener la lista de compañías");
    }
  }
};

export const fetchCompanyDetails = async (id: number) => {
  //
  // funcion para recuperar los miembros de la jefatura y guardarlos por management
  const fetchUsersByManagement = async (managementId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user-management/${managementId}`
      );
      // const response = await fetch(
      //   `https://gipit-back.vercel.app/api/user-management/${managementId}`
      // );
      if (!response.ok) {
        throw new Error("Error fetching integrantes");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching integrantes:", error);
    }
  };

  try {
    const companyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/company/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!companyResponse.ok) {
      throw new Error("Error al obtener los detalles de la compañía");
    }

    const companyData = await companyResponse.json();

    const managementResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/management?company_id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!managementResponse.ok) {
      throw new Error("Error al obtener las jefaturas");
    }

    const managementsFromCompany = await managementResponse.json();
    const managementsToReturn: Jefatura[] = [];
    for (const m of managementsFromCompany) {
      const integrantes = await fetchUsersByManagement(m.id); // Espera a que se resuelva el fetch
      managementsToReturn.push({
        name: m.name,
        id: m.id,
        integrantes: integrantes || [],
      });
    }

    const companyDetails = {
      id: id,
      name: companyData.name,
      jefaturas: managementsToReturn,
      logo: companyData.logo,
    };

    return companyDetails;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error al obtener los detalles de la compañía: ${
          error.message || "Error desconocido"
        }`
      );
    } else {
      return {
        id: id,
        name: "Nombre no disponible",
        jefaturas: [],
        logo: "/logopordefault.png",
      };
    }
  }
};
