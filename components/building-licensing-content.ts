export type BuildingLicensingProcessStep = {
  title: string;
  description: string;
};

export const BUILDING_LICENSING_PROCESS_EYEBROW = "PROCESS";
export const BUILDING_LICENSING_PROCESS_TITLE = "תהליך העבודה";
export const BUILDING_LICENSING_PROCESS_SUBTITLE =
  "מתכנון ראשוני ועד אישורי הרשות — ליווי מדויק, שקוף ומקצועי בכל שלב.";
export const BUILDING_LICENSING_PROCESS_CTA_LEAD =
  "מוכנים להתחיל? נשמח ללוות אתכם מהשלב הראשון.";
export const BUILDING_LICENSING_PROCESS_CTA_BUTTON = "לתיאום שיחה";

export const BUILDING_LICENSING_PROCESS_STEPS: BuildingLicensingProcessStep[] = [
  {
    title: "ייעוץ ראשוני ואפיון הפרויקט",
    description:
      "מגדירים מטרות, מגבלות, לוחות זמנים ותקציב, ומבססים תוכנית עבודה ברורה להמשך.",
  },
  {
    title: "סקר מצב קיים ותכנון ראשוני",
    description:
      "בוחנים את המצב הקיים, דרישות הרשות והאילוצים — ומגבשים כיוון תכנוני ראשוני.",
  },
  {
    title: "הכנת תוכניות אדריכליות ומסמכי ליווי",
    description:
      "מכינים תוכניות, חתכים ומסמכים נדרשים בהתאם לדרישות הרשות והפרויקט.",
  },
  {
    title: "הגשה לרשות וטיפול בהערות",
    description:
      "מגישים את התיק, מטפלים בהערות ומבצעים התאמות עד לעמידה בדרישות.",
  },
  {
    title: "קבלת היתר / אישורי בנייה",
    description:
      "מלווים את התהליך עד לקבלת אישורי הבנייה והיתרים הנדרשים לביצוע.",
  },
  {
    title: "ליווי עד אישור סופי ומסירה לביצוע",
    description:
      "מסיימים את התהליך הבירוקרטי ומוסרים חבילת תוכניות מוכנה לביצוע בשטח.",
  },
];
