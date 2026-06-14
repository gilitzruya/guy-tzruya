import type { BuildingLicensingProcessStep } from "@/components/building-licensing-content";

export const BUSINESS_LICENSING_PROCESS_EYEBROW = "PROCESS";
export const BUSINESS_LICENSING_PROCESS_TITLE = "תהליך העבודה";
export const BUSINESS_LICENSING_PROCESS_SUBTITLE =
  "מתכנון ראשוני ועד אישורי הרשות — ליווי מקצועי ומדויק לרישוי עסקים בכל שלב.";
export const BUSINESS_LICENSING_PROCESS_CTA_LEAD =
  "רוצים להתקדם עם הרישוי? נשמח ללוות אתכם מהשלב הראשון.";
export const BUSINESS_LICENSING_PROCESS_CTA_BUTTON = "לתיאום שיחה";

export const BUSINESS_LICENSING_PROCESS_STEPS: BuildingLicensingProcessStep[] = [
  {
    title: "ייעוץ ראשוני ואפיון העסק",
    description:
      "מגדירים מטרות עסקיות, צרכים תפעוליים, לוחות זמנים ותקציב כדי לבנות תוכנית עבודה ברורה.",
  },
  {
    title: "סקר מצב קיים, זכויות ושימושים",
    description:
      "בודקים את המצב בשטח, התאמת השימוש והדרישות התכנוניות מול הרשות המקומית.",
  },
  {
    title: "הכנת תוכניות ומסמכי רישוי",
    description:
      "מכינים תוכניות אדריכליות, נספחים ומסמכי ליווי בהתאם לסוג העסק ולדרישות הרשות.",
  },
  {
    title: "הגשה לרשות וטיפול בהערות",
    description:
      "מגישים את התיק, מלווים את הבדיקה המקצועית ומבצעים התאמות עד לעמידה בדרישות.",
  },
  {
    title: "קבלת היתר / אישורי עסק",
    description:
      "מלווים את התהליך עד לקבלת האישורים וההיתרים הנדרשים להפעלה חוקית של העסק.",
  },
  {
    title: "ליווי עד אישור סופי ומסירה",
    description:
      "משלימים את התהליך הבירוקרטי ומוסרים חבילת מסמכים ותוכניות מוכנה להמשך ביצוע. ניתן להרחיב את היקף העבודה גם לתכניות ביצוע ולליווי ביצוע.",
  },
];
