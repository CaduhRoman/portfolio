import ufmsLogo from "../assets/education/ufms.svg";

// Só dados que não mudam com o idioma. Os textos ficam em src/i18n/dictionaries.ts.

export const profile = {
  handle: "caduhroman",
  name: "Carlos Romanow",
  links: {
    github: "https://github.com/caduhroman",
    linkedin: "https://www.linkedin.com/in/carlos-eduardo-romanow-silva-076260281/",
    instagram: "https://www.instagram.com/romanow.dev/",
    email: "caduromanow@hotmail.com",
  },
};

type Education = {
  id: "degree" | "postgrad";
  logo?: string;
  period?: string;
};

export const education: Education[] = [
  { id: "degree", logo: ufmsLogo, period: "2026 – 2028" },
  { id: "postgrad" },
];

export const certifications = [
  {
    id: "ibmPython",
    issuer: "IBM",
    kind: "course",
    url: "https://www.coursera.org/account/accomplishments/verify/OMHH2GVVVYIX",
  },
  {
    id: "efset",
    issuer: "EF SET",
    kind: "language",
    url: "https://cert.efset.org/hNG8au",
  },
  {
    id: "ibmDataviz",
    issuer: "IBM",
    kind: "course",
    url: "https://www.coursera.org/account/accomplishments/verify/O4EEO9S3NLFF",
  },
  {
    id: "dataAnalytics",
    issuer: "Coursera",
    kind: "course",
    url: "https://www.credly.com/badges/183fd62c-9e25-4819-a23d-ba0416178f96/linked_in_profile",
  },
  {
    id: "obmep2017",
    issuer: "OBMEP",
    kind: "award",
    url: "https://premiacao.obmep.org.br/2017/verRelatorioPremiadosMencao-SP.1.do.htm",
  },
  {
    id: "obmep2018",
    issuer: "OBMEP",
    kind: "award",
    url: "https://premiacao.obmep.org.br/2018/verRelatorioPremiadosMencao-SP.1.do.htm",
  },
] as const;
