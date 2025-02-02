import { ReactNode } from "react";
import { ZodType } from "zod";

export interface RouteItem {
  icon?: ReactNode;
  text: string;
  href: string;
  selected?: boolean;
}

export interface UserInfoProps {
  avatarSrc: string;
  avatarType?: "user" | "logo";
  name: string;
  role: string;
  newNotifications: boolean;
}

export interface FormInputProps {
  label?: string;
  placeholder?: string;
  name?: string;
  type:
    | "text"
    | "number"
    | "date"
    | "submit"
    | "email"
    | "textarea"
    | "file"
    | "chips"
    | "select"
    | "cancel";
  value?: string | number;
  defaultValue?: string | number;
  href?: string;
  height?: string;
  options?: { name: string; value: number }[];
  minMax?: number[];
}

export type FormInputsRow = (FormInputProps | FormInputProps[])[];

export type FormBlockProps = {
  rows: FormInputsRow;
  onSubmit: (
    formData: FormData,
    actualRoute: string
  ) => Promise<{ message: string; route: string; statusCode: number }>;
  title?: string;
  message?: string;
  editor?: React.ReactNode; // Añadir esta línea
  validationSchema?: ZodType<unknown>;
};

export interface NavBarCTAProps {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: ReactNode;
}

export interface InnerTabProps {
  name: string;
  id?: number | string;
  root?: string;
  selected?: boolean;
  match?: number; // lo usaremos para mostrar el por ciento de compatibilidad y al mismo tiempo como bandera para saber si es un tab de compañia o de candidato, porque las compañias no tienen compatibilidad.
}

export interface Integrante {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Jefatura {
  name: string;
  id: number;
  integrantes?: Integrante[]; // Lista de integrantes
}

export interface CompanyDetails {
  id: number;
  name: string;
  jefaturas?: Jefatura[]; // Lista de jefaturas
}
